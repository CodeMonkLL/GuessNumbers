FROM python:3.12-slim

WORKDIR /srv

COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/
COPY frontend/ ./frontend/

WORKDIR /srv/backend

CMD ["python", "app.py"]
