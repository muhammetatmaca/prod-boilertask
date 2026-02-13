
import math
import torch
import torch.nn as nn
from model import Seq2SeqTransformer
from torch.utils.data import DataLoader
from typing import List, Tuple
from collections import Counter
from torch.nn.utils.rnn import pad_sequence

# Dummy training data (Question, Answer)
TRAIN_DATA = [
    ("merhaba", "merhaba, size nasıl yardımcı olabilirim?"),
    ("nasılsın", "teşekkür ederim, ben bir yapay zekayım, siz nasılsınız?"),
    ("adın ne", "benim adım crudllm, sizin için buradayım."),
    ("ne yapabilirsin", "sorularınızı cevaplayabilirim, kod yazabilirim ve size yardımcı olabilirim."),
    ("teşekkürler", "rica ederim, her zaman beklerim."),
    ("görüşürüz", "görüşmek üzere, iyi günler."),
    ("selam", "selam, hoş geldiniz!"),
    ("kimsin", "ben bir dil modeliyim, adım crudllm."),
]

# Basic Tokenizer
class SimpleTokenizer:
    def __init__(self, data):
        self.vocab = {"<unk>": 0, "<pad>": 1, "<bos>": 2, "<eos>": 3}
        self.inv_vocab = {0: "<unk>", 1: "<pad>", 2: "<bos>", 3: "<eos>"}
        self.build_vocab(data)

    def build_vocab(self, data):
        counter = Counter()
        for src, tgt in data:
            counter.update(src.split())
            counter.update(tgt.split())
        
        idx = 4
        for word, _ in counter.items():
            if word not in self.vocab:
                self.vocab[word] = idx
                self.inv_vocab[idx] = word
                idx += 1

    def encode(self, text):
        return [self.vocab.get(word, self.vocab["<unk>"]) for word in text.split()]

    def decode(self, indices):
        return " ".join([self.inv_vocab.get(idx, "<unk>") for idx in indices if idx not in [1, 2, 3]])

# Hyperparameters
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
SRC_VOCAB_SIZE = 0
TGT_VOCAB_SIZE = 0
EMB_SIZE = 512
NHEAD = 8
FFN_HID_DIM = 512
BATCH_SIZE = 2
NUM_ENCODER_LAYERS = 3
NUM_DECODER_LAYERS = 3
NUM_EPOCHS = 50

# Logic
tokenizer = SimpleTokenizer(TRAIN_DATA)
SRC_VOCAB_SIZE = len(tokenizer.vocab)
TGT_VOCAB_SIZE = len(tokenizer.vocab)

transformer = Seq2SeqTransformer(NUM_ENCODER_LAYERS, NUM_DECODER_LAYERS, EMB_SIZE,
                                 NHEAD, SRC_VOCAB_SIZE, TGT_VOCAB_SIZE, FFN_HID_DIM)

for p in transformer.parameters():
    if p.dim() > 1:
        nn.init.xavier_uniform_(p)

transformer = transformer.to(DEVICE)
loss_fn = torch.nn.CrossEntropyLoss(ignore_index=tokenizer.vocab["<pad>"])
optimizer = torch.optim.Adam(transformer.parameters(), lr=0.0001, betas=(0.9, 0.98), eps=1e-9)

def generate_square_subsequent_mask(sz):
    mask = (torch.triu(torch.ones((sz, sz), device=DEVICE)) == 1).transpose(0, 1)
    mask = mask.float().masked_fill(mask == 0, float('-inf')).masked_fill(mask == 1, float(0.0))
    return mask

def create_mask(src, tgt):
    src_seq_len = src.shape[0]
    tgt_seq_len = tgt.shape[0]

    tgt_mask = generate_square_subsequent_mask(tgt_seq_len)
    src_mask = torch.zeros((src_seq_len, src_seq_len), device=DEVICE).type(torch.bool)

    src_padding_mask = (src == tokenizer.vocab["<pad>"]).transpose(0, 1)
    tgt_padding_mask = (tgt == tokenizer.vocab["<pad>"]).transpose(0, 1)
    return src_mask, tgt_mask, src_padding_mask, tgt_padding_mask

# Prepare Data
def collate_fn(batch):
    src_batch, tgt_batch = [], []
    for src_sample, tgt_sample in batch:
        src_batch.append(torch.tensor([tokenizer.vocab["<bos>"]] + tokenizer.encode(src_sample) + [tokenizer.vocab["<eos>"]]))
        tgt_batch.append(torch.tensor([tokenizer.vocab["<bos>"]] + tokenizer.encode(tgt_sample) + [tokenizer.vocab["<eos>"]]))
    src_batch = pad_sequence(src_batch, padding_value=tokenizer.vocab["<pad>"])
    tgt_batch = pad_sequence(tgt_batch, padding_value=tokenizer.vocab["<pad>"])
    return src_batch, tgt_batch

train_dataloader = DataLoader(TRAIN_DATA, batch_size=BATCH_SIZE, collate_fn=collate_fn)

def train_epoch(model, optimizer):
    model.train()
    losses = 0
    for src, tgt in train_dataloader:
        src = src.to(DEVICE)
        tgt = tgt.to(DEVICE)

        tgt_input = tgt[:-1, :]
        tgt_out = tgt[1:, :]

        src_mask, tgt_mask, src_padding_mask, tgt_padding_mask = create_mask(src, tgt_input)

        logits = model(src, tgt_input, src_mask, tgt_mask, src_padding_mask, tgt_padding_mask, src_padding_mask)
        optimizer.zero_grad()
        loss = loss_fn(logits.reshape(-1, logits.shape[-1]), tgt_out.reshape(-1))
        loss.backward()
        optimizer.step()
        losses += loss.item()
    return losses / len(train_dataloader)

# Training Loop
if __name__ == "__main__":
    print(f"Training on {DEVICE}...")
    for epoch in range(1, NUM_EPOCHS+1):
        loss = train_epoch(transformer, optimizer)
        if epoch % 10 == 0:
            print(f"Epoch: {epoch}, Loss: {loss:.4f}")
    
    print("Saving model...")
    torch.save(transformer.state_dict(), "model.pth")
    # Save vocab too
    import json
    with open('vocab.json', 'w', encoding='utf-8') as f:
        json.dump(tokenizer.vocab, f)
    print("Training complete.")

