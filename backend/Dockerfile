# Use an official Python base image
FROM python:3.13

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
RUN pip install uv

# Copy app files
COPY . .

# Install FastAPI and other dependencies
RUN uv sync

# Expose FastAPI default port
EXPOSE 8000

# Command to run FastAPI app
WORKDIR /app/src

ENTRYPOINT ["uv", "run", "--", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
