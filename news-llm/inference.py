from os import environ

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import logging

app = FastAPI()

# --- Настройка логирования ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Конфигурация Yandex LLM (лучше вынести в переменные окружения)
URL = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"

API_KEY = environ.get("YANDEX_CLOUD_API_KEY")
if not API_KEY:
    raise KeyError("Environment variable YANDEX_CLOUD_API_KEY not specified")

FOLDER_ID = environ.get("YANDEX_CLOUD_FOLDER_ID")
if not FOLDER_ID:
    raise KeyError("Environment variable YANDEX_CLOUD_FOLDER_ID not specified")

class NewsRequest(BaseModel):
    query: str = "роснефть"
    language: str = "ru"
    page_size: int = 2

class NewsAnalysis(BaseModel):
    title: str
    description: str
    url: str
    analysis: str

class NewsResponse(BaseModel):
    results: list[NewsAnalysis]

# --- Инициализация клиентов ---
newsapi = NewsApiClient(api_key=NEWSAPI_KEY)

def analyze_with_yagpt(text: str) -> str:
    """Анализ текста через Yandex GPT"""
    prompt = {
        "modelUri": f"gpt://{FOLDER_ID}/yandexgpt",
        "completionOptions": {
            "stream": False,
            "temperature": 0.6,
            "maxTokens": "1000"
        },
        "messages": [
            {
                "role": "system",
                "text": "Ты - финансовый аналитик. Выдели ключевые факты и оцени влияние события на компанию."
            },
            {
                "role": "user",
                "text": text[:2000]  # Ограничение длины текста
            }
        ]
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Api-Key {YANDEX_API_KEY}"
    }

    try:
        logger.info("Отправка запроса в Yandex GPT...")
        response = requests.post(YANDEX_URL, headers=headers, json=prompt, timeout=10)
        response.raise_for_status()
        return response.json()['result']['alternatives'][0]['message']['text']
    except Exception as e:
        logger.error(f"Ошибка Yandex GPT: {str(e)}")
        return f"Ошибка анализа: {str(e)}"

@app.post("/news-analysis", response_model=NewsResponse)
async def get_news_analysis(request: NewsRequest):
    """Получение и анализ новостей"""
    try:
        logger.info(f"Поиск новостей по запросу: '{request.query}'")
        
        # Получение новостей
        news_data = newsapi.get_everything(
            q=request.query,
            language=request.language,
            sort_by="publishedAt",
            page_size=request.page_size
        )

        if not news_data.get("articles"):
            logger.warning("Новости не найдены!")
            return NewsResponse(results=[])

        results = []
        for article in news_data["articles"]:
            try:
                # Формирование текста для анализа
                title = article.get("title", "Без заголовка")
                description = article.get("description", "Без описания")
                text_to_analyze = f"{title}\n\n{description}"
                
                logger.info(f"Анализ статьи: {title[:50]}...")
                
                # Анализ текста
                analysis = analyze_with_yagpt(text_to_analyze)
                
                # Формирование результата
                results.append(NewsAnalysis(
                    title=title,
                    description=description,
                    url=article.get("url", ""),
                    analysis=analysis
                ))
                
            except Exception as e:
                logger.error(f"Ошибка обработки статьи: {str(e)}")
                continue

        return NewsResponse(results=results)
        
    except Exception as e:
        logger.critical(f"Критическая ошибка: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))