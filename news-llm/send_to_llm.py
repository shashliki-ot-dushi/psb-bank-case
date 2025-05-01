import requests

api_key = 'AQVNzzJielnSayrAOlQWlxDMK49OShvzdqtUQdAp'
folder_id = 'b1gst3c7cskk2big5fqn'

prompt = {
    "modelUri": "gpt://" + folder_id + "/yandexgpt",
    "completionOptions": {
        "stream": False,
        "temperature": 0.6,
        "maxTokens": "2000"
    },
    "messages": [
        {
            "role": "system",
            "text": "Ты - кредитный ассистент. Я буду подавать тебе на вход краткую выжимку или несколько выжимок новостей о предприятии, а ты должен их проанализировать и обьяснить специалисту по выдаче кредитов, что пишут о предприятии. Проанализируй присланный текст."
        },
        {
            "role": "user",
            "text": "Президент России Владимир Путин дал разрешение ЗАО «Балчуг капитал» на приобретение и продажу акций российских компаний у Goldman Sachs. Путин подписал распоряжение, разрешающее ЗАО «Балчуг капитал» приобрести акции ряда российских компаний, которые в настоящ… "
        }
    ]
}


url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Api-Key " + api_key
}

response = requests.post(url, headers=headers, json=prompt)
result = response.text
print(result)