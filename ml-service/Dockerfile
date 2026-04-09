# ML Inference Engine Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install dependencies separately to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the API port
EXPOSE 8000

# Start the application
CMD ["uvicorn", "fraud_api:app", "--host", "0.0.0.0", "--port", "8000"]
