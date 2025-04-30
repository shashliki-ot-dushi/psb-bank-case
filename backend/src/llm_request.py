import requests

BASE_URL = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"

def query_yandex(
    user_text: str,
    api_key: str,
    folder_id: str,
    temperature: float = 0.6,
    max_tokens: int = 2000
) -> str:
    """
    Отправляет текст пользователя в YandexGPT через API Yandex Cloud
    и возвращает ответ ассистента в виде строки.
    """
    prompt = {
        "modelUri": f"gpt://{folder_id}/yandexgpt",
        "completionOptions": {
            "stream": False,
            "temperature": temperature,
            "maxTokens": str(max_tokens)
        },
        "messages": [
            {
                "role": "system",
                "text": (
                    "Ты профессионал в анализе деятельности юридических лиц. Твоя цель - используя статистические данные различных сфер компании и метрики максимально подробно объяснить, почему компания получила тот или иной скор. Скор измеряется от 0 до 1, где 1 - кампания псевдо-банкрот, а 0 - которая точно не обанкротиться"
                )
            },
            {
                "role": "user",
                "text": user_text
            }
        ]
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Api-Key " + api_key
    }

    resp = requests.post(BASE_URL, headers=headers, json=prompt)
    resp.raise_for_status()

    data = resp.json()
    # Парсим структуру ответа:
    # {"result": {"alternatives": [{"message": {"role": "assistant", "text": ...}}], ...}}
    try:
        return data["result"]["alternatives"][0]["message"]["text"]
    except (KeyError, IndexError) as e:
        raise RuntimeError(f"Невозможно разобрать ответ сервера: {data}") from e