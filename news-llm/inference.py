from os import environ

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests

app = FastAPI()

# Конфигурация Yandex LLM (лучше вынести в переменные окружения)
URL = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"

API_KEY = environ.get("YANDEX_CLOUD_API_KEY")
if not API_KEY:
    raise KeyError("Environment variable YANDEX_CLOUD_API_KEY not specified")

FOLDER_ID = environ.get("YANDEX_CLOUD_FOLDER_ID")
if not FOLDER_ID:
    raise KeyError("Environment variable YANDEX_CLOUD_FOLDER_ID not specified")

# Модели запроса/ответа
class AnalysisRequest(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    analysis_result: str
    status: str = "success"

def send_to_yandex_gpt(user_text: str) -> str:
    """Отправляет запрос к Yandex LLM API"""
    prompt = {
        "modelUri": f"gpt://{FOLDER_ID}/yandexgpt",
        "completionOptions": {
            "stream": False,
            "temperature": 0.6,
            "maxTokens": "2000"
        },
        "messages": [
            {
                "role": "system",
                "text": "Ты - кредитный ассистент. Анализируй предоставленные новости о предприятии и объясни специалисту по кредитам ключевые моменты. Будь кратким и конкретным."
            },
            {
                "role": "user",
                "text": user_text
            }
        ]
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Api-Key {API_KEY}"
    }

    try:
        response = requests.post(URL, headers=headers, json=prompt)
        response.raise_for_status()
        return response.json()['result']['alternatives'][0]['message']['text']
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM API error: {str(e)}")

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_text(request: AnalysisRequest):
    """Основной эндпоинт для анализа текста"""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Текст не может быть пустым")
    
    try:
        analysis_result = send_to_yandex_gpt(request.text)
        return AnalysisResponse(analysis_result=analysis_result)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")