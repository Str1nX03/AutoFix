import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

try:
    texts = ["Hello world", "Another string", "Third string"]
    response = client.models.embed_content(
        model="gemini-embedding-2",
        contents=texts
    )
    print(f"Passed {len(texts)} texts.")
    print(f"Received {len(response.embeddings)} embeddings.")
except Exception as e:
    print("Error:", e)
