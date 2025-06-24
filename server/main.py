from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn as nn
import torch.nn.functional as F

# 문자 인덱스 정의
all_chars = list("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*?/\\ ")
char2idx = {c:i+1 for i,c in enumerate(all_chars)}  # padding: 0
idx2char = {i:c for c,i in char2idx.items()}

# 인코딩 함수
def encode_password(pw, max_len=40):
    pw = pw[:max_len]
    seq = [char2idx.get(c, 0) for c in pw]
    seq += [0] * (max_len - len(seq))
    return seq

# 모델 클래스
class LSTMClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim=32, hidden_dim=64, num_classes=3):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, num_classes)
    def forward(self, x):
        x = self.embedding(x)
        _, (hn, _) = self.lstm(x)
        out = self.fc(hn[-1])
        return out

# FastAPI 앱
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 모델 로딩
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = LSTMClassifier(vocab_size=len(char2idx)+1).to(device)
model.load_state_dict(torch.load("./lstm_password_classifier_76941.pt", map_location=device))
model.eval()

# 요청 모델
class Input(BaseModel):
    password: str

# 엔드포인트
@app.post("/check-password", status_code=status.HTTP_200_OK)
def check_password(data: Input, response: Response):
    global label
    try:
        x = torch.tensor([encode_password(data.password)], dtype=torch.long).to(device)
        with torch.no_grad():
            out = model(x)
            probs = F.softmax(out, dim=1).cpu().numpy()[0]
            pred = torch.argmax(out, dim=1).item()
        label = ["weak", "normal", "strong"][pred]
    except Exception as e:
        response.status_code = status.HTTP_418_IM_A_TEAPOT
        return { "error": str(e)+"\nHTTP_418, Model Error" }
    return {
        "strength": label,
        "scores": {
            "weak": float(probs[0]),
            "normal": float(probs[1]),
            "strong": float(probs[2]),
        }
    }
