FROM python:3.11-slim

WORKDIR /app

# Устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код
COPY src/ ./src/

# Открываем порт
EXPOSE 8000

# Запускаем приложение
CMD ["uvicorn", "src.__main__:app", "--host", "0.0.0.0", "--port", "8000"] 