from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os
import numpy as np
import sys

from agents_src.exception import CustomException

load_dotenv(dotenv_path="database/.env")

def generate_embeddings(text: str)-> list[float]:

    try:
        HF_TOKEN = os.getenv("HUGGINGFACE_HUB_API_TOKEN")
        EMD_MODEL=os.getenv("EMBEDDING_MODEL")
        client = InferenceClient(token=HF_TOKEN, provider="hf-inference")

        result = client.feature_extraction(text, model=EMD_MODEL)

        if isinstance(result, np.ndarray):
            flat_result = result.flatten().tolist()
            return flat_result
        elif isinstance(result, list):
            if len(result) > 0 and isinstance(result[0], list):
                return result[0]
            return result

        return result
    
    except Exception as e:
        raise CustomException(e, sys)

