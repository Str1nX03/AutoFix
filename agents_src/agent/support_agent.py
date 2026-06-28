from typing import TypedDict, Dict, Any, Optional
from agents_src.utils import get_llm
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
    product_name: Optional[str]

class SupportAgent:

    def __init__(self):

        self.llm = get_llm()
        self.graph = self._build_graph()

    def _product_detection_(self, state: AgentState) -> AgentState:
        """
        Analyzes the input to extract the Product Name.
        """
        user_query = state.get("user_query", "")
        # TODO: Implement actual logic to extract product name from user query
        # using PRODUCT_DETECTION_PROMPT and an LLM.
        # Placeholder: Check if "product" is in the query.
        product_detected = "product" in user_query.lower()
        
        return {
            "product_name": "Example Product" if product_detected else None
        }

    def _check_product_detected(self, state: AgentState) -> str:
        """
        Condition: Product Detected?
        """
        if state.get("product_name"):
            return "yes"
        return "no"

    def _retrieve_product_info_(self, state: AgentState) -> AgentState:
        """
        Retrieves product information based on the detected product name.
        """
        product_name = state.get("product_name")
        # TODO: Implement actual DB/API lookup here
        return {
            "product_info": {"name": product_name, "status": "active", "details": "Sample product details"}
        }

    def _product_support_(self, state: AgentState) -> AgentState:
        """
        Receives Product info + User Query and generates a response regarding the product.
        """
        product_info = state.get("product_info", {})
        user_query = state.get("user_query", "")
        
        # TODO: Implement actual LLM call using PRODUCT_SUPPORT_PROMPT
        response = f"Support response for product: {product_info.get('name')}. Query: {user_query}"
        
        return {"support_response": response}

    def _general_support_(self, state: AgentState) -> AgentState:
        """
        Receives User Query and generates a response for non-product related questions.
        """
        user_query = state.get("user_query", "")
        
        # TODO: Implement actual LLM call using GENERAL_SUPPORT_PROMPT
        response = f"General support response. Query: {user_query}"
            
        return {"support_response": response}

    def _build_graph(self):
        """
        Builds and compiles the LangGraph workflow.
        """
        workflow = StateGraph(AgentState)
        
        # Add nodes
        workflow.add_node("_product_detection_", self._product_detection_)
        workflow.add_node("_retrieve_product_info_", self._retrieve_product_info_)
        workflow.add_node("_product_support_", self._product_support_)
        workflow.add_node("_general_support_", self._general_support_)
        
        # Entry point
        workflow.set_entry_point("_product_detection_")
        
        # Conditional routing after product detection
        workflow.add_conditional_edges(
            "_product_detection_",
            self._check_product_detected,
            {
                "yes": "_retrieve_product_info_",
                "no": "_general_support_"
            }
        )
        
        # If product is retrieved, pass to product support
        workflow.add_edge("_retrieve_product_info_", "_product_support_")
        
        # Both support paths lead to the end of the graph
        workflow.add_edge("_product_support_", END)
        workflow.add_edge("_general_support_", END)
        
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
            "product_name": None
        }
        
        # Invoke the graph
        result = self.graph.invoke(initial_state)
        return result