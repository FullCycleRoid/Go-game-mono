from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.endpoints import game, player, invites
from src.database import engine
from src import models

# Создаем таблицы
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Go Game API", version="1.0.0")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(game.router, prefix="/api/games", tags=["games"])
app.include_router(player.router, prefix="/api/players", tags=["players"])
app.include_router(invites.router, prefix="/api/invites", tags=["invites"])


@app.get("/")
def read_root():
    return {"message": "Go Game API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"} 