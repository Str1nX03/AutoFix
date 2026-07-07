from typing import TypedDict, Dict, Any, Optional, List, Annotated
import operator
from agents_src.utils import get_llm
from langchain_core.prompts import ChatPromptTemplate
import pandas as pd
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
            
            structured_llm = self.llm.with_structured_output(schema)
            
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

    def _retrieve_product_info(self, state: AgentState) -> AgentState:
        """
        Retrieves product information based on the detected product names.
        """
        extracted = state["extracted_product_names"]
        shown_products = state["shown_products"]
        product_info_list = []
        new_shown_products = []
        
        try:
            
            csv_path = os.path.join(os.path.dirname(__file__), "mock_products.csv")
            df = pd.read_csv(csv_path)
            
            for query_name in extracted:
                query_words = str(query_name).lower().split()
                
                mask = df['product_name'].apply(lambda x: all(w in str(x).lower() for w in query_words))
                matches = df[mask]
                
                if matches.empty:
                    mask_category = df['category'].apply(lambda x: any(w in str(x).lower() for w in query_words))
                    matches = df[mask_category]
                
                if not matches.empty:
                    
                    unshown_matches = matches[~matches['product_name'].isin(shown_products)]
                    
                    if unshown_matches.empty:
                        product_info_list.append({"product_name": query_name, "error": "All available products for this query have already been shown to the user. No more options left."})
                    else:
                        for _, row in unshown_matches.head(2).iterrows():
                            product_info_list.append({
                                "product_name": row["product_name"],
                                "category": row["category"],
                                "description": row["description"],
                                "price": row["price_inr"],
                                "pros": row["pros"],
                                "cons": row["cons"]
                            })
                            new_shown_products.append(row["product_name"])
                else:
                    
                    product_info_list.append({"product_name": query_name, "error": "Not found in database."})
                
            return {
                "product_info": {"products": product_info_list},
                "shown_products": new_shown_products
            }    
                    
        except Exception as e:
            print(f"Error loading product database: {e}")

    def _product_support(self, state: AgentState) -> AgentState:
        """
        Receives Product info + User Query and generates a response regarding the product.
        """
        product_info = state["product_info"]
        user_query = state["user_query"]
        chat_history_list = state["chat_history"]
        chat_history_str = "\n".join(chat_history_list)
        
        try:
            prompt = ChatPromptTemplate.from_template(PRODUCT_SUPPORT_PROMPT)
            chain = prompt | self.llm
            
            formatted_info = str(product_info["products"])
            
            result = chain.invoke({
                "product_info": formatted_info,
                "user_query": user_query,
                "chat_history": chat_history_str
            })
            
            response = result.content

            return {
            "support_response": response,
            "chat_history": [f"User: {user_query}", f"Agent: {response}"]
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
            chain = prompt | self.llm
            result = chain.invoke({
                "user_query": user_query,
                "chat_history": chat_history_str
            })
            response = result.content

            return {
            "support_response": response,
            "chat_history": [f"User: {user_query}", f"Agent: {response}"]
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

        workflow.set_entry_point(START, "product_detection")
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
        Executes the agent workflow with the given query and session_id.
        """
        config = {"configurable": {"thread_id": session_id}}
        update_state = {
            "user_query": query,
            "session_id": session_id,
        }
        result = self.graph.invoke(update_state, config=config)
        return result