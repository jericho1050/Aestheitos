FROM python:3.11-slim as builder

# Install Rust (Cargo) for rpds-py or other packages needing rust
RUN apt-get update && apt-get install -y --no-install-recommends \
    cargo \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY . .

EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "Aestheitos.wsgi:application"]