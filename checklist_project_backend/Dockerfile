# 1) builder
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt -t /deps

# 2) runtime
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app

# deps 복사
COPY --from=builder /deps /usr/local/lib/python3.11/site-packages

# 앱 소스만 복사
COPY app ./app

# .env는 이미지에 굽지 않는 걸 권장(비밀 유출 방지)
# 필요하다면 아래 주석 해제 가능하지만 런타임 -e가 더 안전함
# COPY .env ./.env

EXPOSE 8000
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
