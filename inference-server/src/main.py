from functools import lru_cache
from typing import Dict, List

import torch
from fastapi import FastAPI, HTTPException
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
)

from schemas import InferenceRequest, InferenceResponse, OutputItem

HF_TOKEN = "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"

MODEL_REGISTRY: Dict[str, str] = {
    "arbitr":       "utyfull/contract-arbitr_extra",
    "egrul":        "utyfull/contract-egrul_extra",
    "contracts":    "utyfull/contract-contracts_extra",
    "finances":     "utyfull/contract-finances_extra",
    "enforcements": "utyfull/contract-enfoercemetns_extra",
}


@lru_cache(maxsize=len(MODEL_REGISTRY))
def load_model(model_id: str):
    model = AutoModelForSequenceClassification.from_pretrained(model_id, token=HF_TOKEN)
    tokenizer = AutoTokenizer.from_pretrained(model_id, token=HF_TOKEN)
    model.eval()
    return model, tokenizer


def compute_top20(last_attn: torch.Tensor,
                  input_ids: torch.Tensor,
                  tokenizer,
                  k: int = 20
) -> List[dict]:
    """
    Compute top-k token importances from last attention head.
    last_attn: [batch, heads, seq, seq]
    input_ids: [batch, seq]
    """
    avg_attn = last_attn.mean(dim=1)
    cls_attn = avg_attn[:, 0, 1:]
    cls_attn = torch.nan_to_num(cls_attn, nan=0.0)
    k = min(k, cls_attn.size(1))
    topk = torch.topk(cls_attn, k=k, dim=1)
    idxs, vals = topk.indices, topk.values
    results = []
    for i in range(idxs.size(0)):
        ids = input_ids[i, 1:][idxs[i]].tolist()
        toks = tokenizer.convert_ids_to_tokens(ids)
        scores = vals[i].detach().cpu().tolist()
        results.append(dict(zip(toks, scores)))
    return results


def predict(model_key: str, req: InferenceRequest) -> InferenceResponse:
    if not req.inputs:
        raise HTTPException(400, "No input texts provided")

    if model_key not in MODEL_REGISTRY:
        raise HTTPException(404, f"Unknown model_key '{model_key}'")

    model, tokenizer = load_model(MODEL_REGISTRY[model_key])
    texts = [item.data for item in req.inputs]
    enc = tokenizer(texts, padding=True, truncation=True, return_tensors="pt")

    with torch.no_grad():
        out = model(**enc)

    probs = torch.softmax(out.logits, dim=1)
    labels = ["LABEL_1" if p[1] > p[0] else "LABEL_0" for p in probs]
    scores = probs[:, 1].tolist()
    top20s = compute_top20(out.attentions[-1], enc["input_ids"], tokenizer)

    outputs = [OutputItem(label=l, score=s, top20=t)
               for l, s, t in zip(labels, scores, top20s)]
    return InferenceResponse(outputs=outputs)


app = FastAPI(title="Multi-model contract classifier")


@app.post("/predict/arbitr", response_model=InferenceResponse)
def predict_arbitr(req: InferenceRequest):
    return predict("arbitr", req)


@app.post("/predict/egrul", response_model=InferenceResponse)
def predict_egrul(req: InferenceRequest):
    return predict("egrul", req)


@app.post("/predict/contracts", response_model=InferenceResponse)
def predict_contracts(req: InferenceRequest):
    return predict("contracts", req)


@app.post("/predict/finances", response_model=InferenceResponse)
def predict_finances(req: InferenceRequest):
    return predict("finances", req)


@app.post("/predict/enforcements", response_model=InferenceResponse)
def predict_enforcements(req: InferenceRequest):
    return predict("enforcements", req)
