FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

WORKDIR /app/src

ENV PYTHONUNBUFFERED=1

CMD ["sh", "-c", "uvicorn inference:app --host 0.0.0.0 --port 8000 --workers ${WEB_CONCURRENCY:-$(nproc)}"]
