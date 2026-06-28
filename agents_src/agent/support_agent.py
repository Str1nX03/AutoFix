from typing import TypedDict, Dict, Any, Optional, List
from agents_src.utils import get_llm
from langchain_core.prompts import ChatPromptTemplate
import pandas as pd
import os
import sys
from agents_src.exception import CustomException
from langgraph.graph import StateGraph, END
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

class SupportAgent:

    def __init__(self):

        self.llm = get_llm()
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
        extracted = state["extracted_product_names"]
        if extracted and len(extracted) > 0:
            return "yes"
        return "no"

    def _retrieve_product_info(self, state: AgentState) -> AgentState:
        """
        Retrieves product information based on the detected product names.
        """
        extracted = state["extracted_product_names"]
        product_info_list = []
        
        try:
            # Construct path to mock_products.csv relative to this file
            csv_path = os.path.join(os.path.dirname(__file__), "mock_products.csv")
            df = pd.read_csv(csv_path)
            
            for query_name in extracted:
                # First try to match by product_name
                mask = df['product_name'].str.contains(query_name, case=False, na=False)
                matches = df[mask]
                
                # If no product name matches, try matching by category
                if matches.empty:
                    mask_category = df['category'].str.contains(query_name, case=False, na=False)
                    matches = df[mask_category]
                
                if not matches.empty:
                    # Extract up to 2 products from the matches
                    for _, row in matches.head(2).iterrows():
                        product_info_list.append({
                            "product_name": row["product_name"],
                            "category": row["category"],
                            "description": row["description"],
                            "price": row["price_inr"],
                            "pros": row["pros"],
                            "cons": row["cons"]
                        })
                else:
                    # Append a placeholder if not found
                    product_info_list.append({"product_name": query_name, "error": "Not found in database."})
                
            return {
            "product_info": {"products": product_info_list}
            }    
                    
        except Exception as e:
            print(f"Error loading product database: {e}")

    def _product_support(self, state: AgentState) -> AgentState:
        """
        Receives Product info + User Query and generates a response regarding the product.
        """
        product_info = state["product_info"]
        user_query = state["user_query"]
        
        # TODO: Implement actual LLM call using PRODUCT_SUPPORT_PROMPT
        product_names = [p.get('product_name') for p in product_info.get('products', [])]
        response = f"Support response for products: {product_names}. Query: {user_query}"
        
        return {"support_response": response}

    def _general_support(self, state: AgentState) -> AgentState:
        """
        Receives User Query and generates a response for non-product related questions.
        """
        user_query = state["user_query"]
        
        # TODO: Implement actual LLM call using GENERAL_SUPPORT_PROMPT
        response = f"General support response. Query: {user_query}"
            
        return {"support_response": response}

    def _build_graph(self):
        """
        Builds and compiles the LangGraph workflow.
        """
        workflow = StateGraph(AgentState)
        
        # Add nodes
        workflow.add_node("product_detection", self._product_detection)
        workflow.add_node("retrieve_product_info", self._retrieve_product_info)
        workflow.add_node("product_support", self._product_support)
        workflow.add_node("general_support", self._general_support)
        
        # Entry point
        workflow.set_entry_point("product_detection")
        
        # Conditional routing after product detection
        workflow.add_conditional_edges(
            "product_detection",
            self._check_product_detected,
            {
                "yes": "retrieve_product_info",
                "no": "general_support"
            }
        )
        
        # If product is retrieved, pass to product support
        workflow.add_edge("retrieve_product_info", "product_support")
        
        # Both support paths lead to the end of the graph
        workflow.add_edge("product_support", END)
        workflow.add_edge("general_support", END)
        
        return workflow.compile()

    def run(self, query: str, session_id: str) -> Dict[str, Any]:
        """
        Executes the agent workflow with the given query and session_id.
        """
        initial_state = {
            "user_query": query,
            "session_id": session_id,
            "product_info": {},
            "support_response": "",
            "extracted_product_name": []
        }
        
        # Invoke the graph
        result = self.graph.invoke(initial_state)
        return result