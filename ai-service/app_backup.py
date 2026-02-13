
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import json
from model import Seq2SeqTransformer

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

# Use the same tokenizer class (should be in a shared lib)
class SimpleTokenizer:
    def __init__(self, vocab_path):
        with open(vocab_path, 'r', encoding='utf-8') as f:
            self.vocab = json.load(f)
        self.inv_vocab = {v: k for k, v in self.vocab.items()}

    def encode(self, text):
        return [self.vocab.get(word, self.vocab.get("<unk>")) for word in text.split()]

    def decode(self, indices):
        return " ".join([self.inv_vocab.get(idx, "<unk>") for idx in indices if idx not in [1, 2, 3]])

# Load Model
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
VOCAB_PATH = 'vocab.json'
MODEL_PATH = 'model.pth'

# Load vocab first
try:
    tokenizer = SimpleTokenizer(VOCAB_PATH)
    VOCAB_SIZE = len(tokenizer.vocab)
    EMB_SIZE = 512
    NHEAD = 8
    FFN_HID_DIM = 512
    NUM_ENCODER_LAYERS = 3
    NUM_DECODER_LAYERS = 3

    model = Seq2SeqTransformer(NUM_ENCODER_LAYERS, NUM_DECODER_LAYERS, EMB_SIZE,
                                 NHEAD, VOCAB_SIZE, VOCAB_SIZE, FFN_HID_DIM)

    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    print("Model loaded successfully.")
except Exception as e:
    print(f"Model loading failed: {e}")
    model = None

def greedy_decode(model, src, src_mask, max_len, start_symbol):
    src = src.to(DEVICE)
    src_mask = src_mask.to(DEVICE)

    memory = model.encode(src, src_mask)
    ys = torch.ones(1, 1).fill_(start_symbol).type(torch.long).to(DEVICE)
    for i in range(max_len-1):
        memory = memory.to(DEVICE)
        tgt_mask = (generate_square_subsequent_mask(ys.size(0))
                    .type(torch.bool)).to(DEVICE)
        out = model.decode(ys, memory, tgt_mask)
        out = out.transpose(0, 1)
        prob = model.generator(out[:, -1])
        _, next_word = torch.max(prob, dim=1)
        next_word = next_word.item()

        ys = torch.cat([ys,
                        torch.ones(1, 1).type_as(src.data).fill_(next_word)], dim=0)
        if next_word == tokenizer.vocab["<eos>"]:
            break
    return ys

def generate_square_subsequent_mask(sz):
    mask = (torch.triu(torch.ones((sz, sz), device=DEVICE)) == 1).transpose(0, 1)
    mask = mask.float().masked_fill(mask == 0, float('-inf')).masked_fill(mask == 1, float(0.0))
    return mask

@app.post("/chat")
async def chat(request: ChatRequest):
    if not model:
        return {"response": "Model is not ready. Train it first."}
    
    src_sentence = request.message.lower()
    encoded = [tokenizer.vocab["<bos>"]] + tokenizer.encode(src_sentence) + [tokenizer.vocab["<eos>"]]
    src = torch.tensor(encoded).view(-1, 1)
    num_tokens = src.shape[0]
    src_mask = (torch.zeros(num_tokens, num_tokens)).type(torch.bool)
    
    tgt_tokens = greedy_decode(model, src, src_mask, max_len=num_tokens + 5, start_symbol=tokenizer.vocab["<bos>"])
    result = tokenizer.decode(tgt_tokens.flatten().tolist())
    
    # Remove BOS/EOS tokens
    result = result.replace("<bos>", "").replace("<eos>", "").strip()

    return {"response": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
