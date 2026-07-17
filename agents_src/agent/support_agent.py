from typing import TypedDict, Dict, Any, Optional, List, Annotated
import operator
from agents_src.utils import get_llm
from langchain_core.prompts import ChatPromptTemplate
from database.rag_retriever import search_products
from langchain_core.output_parsers import StrOutputParser
import os
import sys
from agents_src.exception import CustomException
from langgraph.graph import StateGraph, END, START
from langgraph.checkpoint.memory import MemorySaver
from agents_src.prompt.support_prompt import (
    PRODUCT_DETECTION_PROMPT,
    PRODUCT_SUPPORT_PROMPT,
    GENERAL_SUPPORT_PROMPT
)

class AgentState(TypedDict):
    """
    Represents the state of our agent through the graph execution.
    """
    product_info: dict
    user_query: str
    support_response: str
    session_id: Optional[str]
    extracted_product_names: List[str]
    chat_history: Annotated[List[str], operator.add]
    shown_products: Annotated[List[str], operator.add]

class SupportAgent:

    def __init__(self):

        self.llm = get_llm()
        self.memory = MemorySaver()
        self.graph = self._build_graph()

    def _product_detection(self, state: AgentState) -> AgentState:
        """
        Analyzes the input to extract all Product Names.
        """
        user_query = state["user_query"]

        try:
        
            prompt = ChatPromptTemplate.from_template(PRODUCT_DETECTION_PROMPT)
            
            schema = {
                "title": "ProductDetection",
                "type": "object",
                "properties": {
                    "extracted_product_names": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of product names extracted from the query"
                    }
                },
                "required": ["extracted_product_names"]
            }
            
            structured_llm = self.llm.with_structured_output(schema, method="json_mode")
            
            chain = prompt | structured_llm
            result = chain.invoke({"user_query": user_query})
            
            extracted = result.get("extracted_product_names", []) if result else []
            
            return {
                "extracted_product_names": extracted
            }
        
        except Exception as e:
            raise CustomException(e,sys)

    def _check_product_detected(self, state: AgentState) -> str:
        """
        Condition: Product Detected?
        """
        try:

            extracted = state["extracted_product_names"]
            if extracted and len(extracted) > 0:
                return "yes"
            return "no"
        
        except Exception as e:
            raise CustomException(e,sys)

    async def _retrieve_product_info(self, state: AgentState) -> AgentState:
        """
        Retrieves product information based on the detected product names using Hugging Face Postgres RAG.
        """
        user_query = state["user_query"]
        shown_products = state["shown_products"]
        product_info_list = []
        new_shown_products = []
        
        try:
            # We pass the raw user query directly to our highly tuned RAG retriever!
            best_products = await search_products(user_query, top_k=5)
            
            if not best_products:
                product_info_list.append({"product_name": "Unknown", "error": "Not found in database."})
            else:
                for p in best_products:
                    # Skip if already shown in this session
                    if p.name in shown_products:
                        continue
                        
                    product_info_list.append({
                        "product_name": p.name,
                        "category": p.product_type,
                        "description": p.description,
                        "price": f"${p.price}",
                        "link": p.Product_Webpage_url
                    })
                    new_shown_products.append(p.name)
                    
                # If everything matched was already shown
                if not product_info_list:
                    product_info_list.append({"product_name": "Multiple", "error": "All available products for this query have already been shown to the user. No more options left."})
                
            return {
                "product_info": {"products": product_info_list},
                "shown_products": new_shown_products
            }    
                    
        except Exception as e:
            print(f"Error retrieving from RAG database: {e}")
            return {
                "product_info": {"products": [{"product_name": "Error", "error": "Internal database error occurred."}]},
                "shown_products": []
            }
    def _product_support(self, state: AgentState) -> AgentState:
        """
        Receives Product info + User Query and generates a response regarding the product.
        """
        product_info = state.get("product_info", {"products": []})
        user_query = state["user_query"]
        chat_history_list = state["chat_history"]
        chat_history_str = "\n".join(chat_history_list)
        
        try:
            prompt = ChatPromptTemplate.from_template(PRODUCT_SUPPORT_PROMPT)
            
            chain = prompt | self.llm | StrOutputParser()
            
            formatted_info = str(product_info["products"])
            
            result = chain.invoke({
                "product_info": formatted_info,
                "user_query": user_query,
                "chat_history": chat_history_str
            })

            return {
            "support_response": result,
            "chat_history": [f"User: {user_query}", f"Agent: {result}"]
            }

        except Exception as e:
            raise CustomException(e, sys)

    def _general_support(self, state: AgentState) -> AgentState:
        """
        Receives User Query and generates a response for non-product related questions.
        """
        user_query = state["user_query"]
        chat_history_list = state["chat_history"]
        chat_history_str = "\n".join(chat_history_list)
        
        try:
            prompt = ChatPromptTemplate.from_template(GENERAL_SUPPORT_PROMPT)
            
            chain = prompt | self.llm | StrOutputParser()
            
            result = chain.invoke({
                "user_query": user_query,
                "chat_history": chat_history_str
            })
            
            return {
            "support_response": result,
            "chat_history": [f"User: {user_query}", f"Agent: {result}"]
            }

        except Exception as e:
            raise CustomException(e, sys)
            
    def _build_graph(self):
        """
        Builds and compiles the LangGraph workflow.
        """
        workflow = StateGraph(AgentState)
        
        workflow.add_node("product_detection", self._product_detection)
        workflow.add_node("retrieve_product_info", self._retrieve_product_info)
        workflow.add_node("product_support", self._product_support)
        workflow.add_node("general_support", self._general_support)

        workflow.set_entry_point("product_detection")
        workflow.add_conditional_edges(
            "product_detection",
            self._check_product_detected,
            {
                "yes": "retrieve_product_info",
                "no": "general_support"
            }
        )
        workflow.add_edge("retrieve_product_info", "product_support")
        workflow.add_edge("product_support", END)
        workflow.add_edge("general_support", END)
        
        return workflow.compile(checkpointer=self.memory)

    def run(self, query: str, session_id: str) -> Dict[str, Any]:
        """
        Executes the agent workflow with the given query and session_id (synchronous wrapper).
        """
        config = {"configurable": {"thread_id": session_id}}
        update_state = {
            "user_query": query,
            "session_id": session_id,
        }
        result = self.graph.invoke(update_state, config=config)
        return result["support_response"]

    async def arun(self, query: str, session_id: str) -> Dict[str, Any]:
        """
        Executes the agent workflow asynchronously with the given query and session_id.
        """
        config = {"configurable": {"thread_id": session_id}}
        update_state = {
            "user_query": query,
            "session_id": session_id,
        }
        result = await self.graph.ainvoke(update_state, config=config)
        return result["support_response"]