
import torch
from torch.utils.data import DataLoader, IterableDataset
from torch.optim import AdamW
from transformers import AutoModelForCausalLM, AutoTokenizer, get_scheduler
from datasets import load_dataset, interleave_datasets
import os

# --- CONFIGURATION (TinyLLAMA - Llama 1.1B) ---
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0" 
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
BATCH_SIZE = 2 # Reduced for 1.1B model safety on CPU
NUM_EPOCHS = 1 # Just 1 epoch is enough for quick adaptation
MAX_SEQ_LEN = 256 
LEARNING_RATE = 2e-5 
GRADIENT_ACCUMULATION_STEPS = 8 

print(f"🚀 Preparing to finetune {MODEL_NAME} on {DEVICE}...")

# 1. Load Tokenizer & Model
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    # Llama typically doesn't have pad token, set it to eos
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right" 
    
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)
    model.to(DEVICE)
    if hasattr(model, "gradient_checkpointing_enable"):
        model.gradient_checkpointing_enable()
        
    print("✓ Model & Tokenizer loaded.")
except Exception as e:
    print(f"❌ Critical Load Error: {e}")
    exit(1)

# 2. Dataset Loading (Streaming)
def load_dataset_stream():
    print("Loading sixfingerdev/chatbot-turkish-dataset-sixfinger-2b...")
    
    def process_data(example):
        src = example.get('instruction') or example.get('prompt') or "" 
        inp = example.get('input') or ""
        tgt = example.get('output') or example.get('response') or ""
        
        if inp: src = f"{src}\n{inp}"
        
        # TinyLlama Chat Format:
        # <|user|>\n{msg}</s>\n<|assistant|>\n{response}</s>
        
        full_text = f"<|user|>\n{src}</s>\n<|assistant|>\n{tgt}</s>"
        
        return {"text": full_text}

    try:
        ds = load_dataset("sixfingerdev/chatbot-turkish-dataset-sixfinger-2b", split="train", streaming=True)
        ds = ds.map(process_data, remove_columns=list(ds.features.keys()))
        return ds
    except Exception as e:
        print(f"Dataset Error, falling back to dummy: {e}")
        def dummy_gen():
            yield {"text": f"<|user|>\nMerhaba</s>\n<|assistant|>\nMerhaba!</s>"}
        return IterableDataset.from_generator(dummy_gen)

# 3. Collate Function
def collate_fn(batch):
    texts = [item['text'] for item in batch]
    encodings = tokenizer(texts, return_tensors='pt', padding=True, truncation=True, max_length=MAX_SEQ_LEN)
    input_ids = encodings.input_ids
    attention_mask = encodings.attention_mask
    
    labels = input_ids.clone()
    labels[attention_mask == 0] = -100
    
    return input_ids, attention_mask, labels

# 4. Training Loop
def train():
    optimizer = AdamW(model.parameters(), lr=LEARNING_RATE)
    
    # Calculate steps (approximate for streaming)
    TOTAL_STEPS = 200 # Short finetuning
    lr_scheduler = get_scheduler(
        name="linear", optimizer=optimizer, num_warmup_steps=20, num_training_steps=TOTAL_STEPS
    )

    model.train()
    dataset = load_dataset_stream()
    dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, collate_fn=collate_fn)
    
    step = 0
    total_loss = 0
    optimizer.zero_grad()
    
    print("🏁 Training Started...")
    
    for epoch in range(NUM_EPOCHS):
        for input_ids, attention_mask, labels in dataloader:
            if step >= TOTAL_STEPS: break
            
            input_ids = input_ids.to(DEVICE)
            attention_mask = attention_mask.to(DEVICE)
            labels = labels.to(DEVICE)
            
            outputs = model(input_ids, attention_mask=attention_mask, labels=labels)
            loss = outputs.loss / GRADIENT_ACCUMULATION_STEPS
            loss.backward()
            
            total_loss += loss.item()
            
            if (step + 1) % GRADIENT_ACCUMULATION_STEPS == 0:
                optimizer.step()
                lr_scheduler.step()
                optimizer.zero_grad()
                
                if (step // GRADIENT_ACCUMULATION_STEPS) % 5 == 0:
                     print(f"Step {step}: Loss {loss.item() * GRADIENT_ACCUMULATION_STEPS:.4f}")
                     total_loss = 0

            step += 1
        
        if step >= TOTAL_STEPS: break
        print(f"Epoch {epoch+1} complete.")

    print("💾 Saving Fine-tuned Model...")
    save_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "finetuned_model")
    model.save_pretrained(save_path)
    tokenizer.save_pretrained(save_path)
    print(f"✅ Model saved to {save_path}")

if __name__ == "__main__":
    try:
        if os.path.exists("model.pth"): os.remove("model.pth")
    except: pass
    
    train()
