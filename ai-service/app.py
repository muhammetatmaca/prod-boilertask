
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import os

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

# 1. Configuration for Causal LM Inference (TinyLlama)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FINETUNED_PATH = os.path.join(BASE_DIR, "finetuned_model")
# Use the exact model name from train.py
BASE_MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

print(f"Loading Model (Device: {DEVICE})...")
try:
    if os.path.exists(FINETUNED_PATH):
        print(f"Server: Loading FINETUNED model from {FINETUNED_PATH}...")
        model_path = FINETUNED_PATH
    else:
        print(f"Server: Loading BASE model {BASE_MODEL_NAME} (Not trained yet)...")
        model_path = BASE_MODEL_NAME

    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForCausalLM.from_pretrained(model_path)
    model.to(DEVICE)
    model.eval()
    print("✓ Model ready.")
except Exception as e:
    print(f"❌ Model Load Error: {e}")
    model = None
    tokenizer = None

@app.post("/chat")
def chat(request: ChatRequest):
    if not model:
        return {"response": "Model is not ready or failed to load."}
    
    # TinyLlama Chat Format
    # <|user|>\n{msg}</s>\n<|assistant|>\n
    prompt = f"<|user|>\n{request.message}</s>\n<|assistant|>\n"
    
    try:
        inputs = tokenizer(prompt, return_tensors="pt").to(DEVICE)
        
        # Generation
        with torch.no_grad():
            outputs = model.generate(
                **inputs, 
                max_new_tokens=150, 
                temperature=0.7, 
                top_p=0.9, 
                do_sample=True,
                repetition_penalty=1.1,
                pad_token_id=tokenizer.eos_token_id
            )
        
        # Decode only the NEW tokens (response)
        input_len = inputs.input_ids.shape[1]
        generated_tokens = outputs[0][input_len:]
        response = tokenizer.decode(generated_tokens, skip_special_tokens=True)
        
        print(f"In: {request.message} | Out: {response}")
        return {"response": response.strip()}

    except Exception as e:
        print(f"Generation Error: {e}")
        return {"response": "Hata oluştu."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
