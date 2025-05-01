#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import logging
from datetime import datetime, timedelta

from newsapi import NewsApiClient
from newspaper import Article
import openai

# --- Настройка логирования ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)

# --- Загрузка ключей из окружения ---
NEWSAPI_KEY = "f5dfbbcdf89e45e499fd718f11ef2663"
# newsapi_test.py

def main():
    # Загрузка ключа из окружения
    api_key = "f5dfbbcdf89e45e499fd718f11ef2663"

    # Инициализация клиента
    newsapi = NewsApiClient(api_key=api_key)

    # Запрос: любые свежие новости на русском языке, сортировка по дате
    response = newsapi.get_everything(
        q="роснефть акции",                # ключевое слово для поиска
        language="ru",             # язык: русский
        sort_by="publishedAt",     # сортировать по дате публикации
        page_size=1,               # получить только одну статью
        page=1
    )

    articles = response.get("articles", [])
    if not articles:
        print("Новостей не найдено.")
        return

    # Берём первую статью
    article = articles[0]
    title = article.get("title", "Без заголовка")
    description = article.get("description", "Без описания")
    url = article.get("url", "")

    # Выводим данные
    print(f"Заголовок: {title}")
    print(f"Краткое описание: {description}")
    print(f"Ссылка: {url}")

if __name__ == "__main__":
    main()