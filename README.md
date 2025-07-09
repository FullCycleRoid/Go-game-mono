# Игра ГО - Многопользовательская онлайн игра

Многопользовательская онлайн игра ГО с интеграцией Telegram WebApp.

## 🏗️ Архитектура

- **Backend**: FastAPI + PostgreSQL + Redis
- **Frontend**: React + TypeScript + Vite
- **Интеграция**: Telegram WebApp
- **Деплой**: Docker + Docker Compose + Nginx

## 🎮 Игровая механика

Игра ГО - это древняя стратегическая игра на поле 9x9 клеток:

1. **Ходы**: Игроки по очереди размещают камни на пересечениях линий
2. **Захват**: Камни захватываются, когда теряют все свободы (окружены)
3. **Правило ко**: Запрещено повторять позицию после захвата одного камня
4. **Самоубийство**: Запрещены ходы, которые приводят к самоубийству группы

## 🚀 Запуск

### Предварительные требования

- Docker и Docker Compose
- Node.js 18+ (для разработки)

### Быстрый запуск

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd go-game-monolith
```

2. Создайте файл `.env` в папке `go-backend`:
```env
ENVIRONMENT=LOCAL
POSTGRES_USER=go_user
POSTGRES_PASSWORD=go_password
POSTGRES_DB=go_game
POSTGRES_HOST=go-db
POSTGRES_PORT=5432
REDIS_URL=redis://go-redis:6379
TELEGRAM_TOKEN=your_telegram_token
```

3. Запустите проект:
```bash
docker-compose up --build
```

4. Откройте браузер:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Nginx: http://localhost:80

## 📁 Структура проекта

```
go-game-monolith/
├── go-backend/           # Backend на FastAPI
│   ├── src/
│   │   ├── endpoints/    # API эндпоинты
│   │   ├── services/     # Игровая логика
│   │   ├── models.py     # Модели БД
│   │   └── schemas.py    # Pydantic схемы
│   ├── Dockerfile
│   └── requirements.txt
├── go-frontend/          # Frontend на React
│   ├── src/
│   │   ├── components/   # React компоненты
│   │   ├── api/          # API клиент
│   │   └── types/        # TypeScript типы
│   ├── Dockerfile
│   └── package.json
├── nginx/                # Nginx конфигурация
└── docker-compose.yml    # Оркестрация
```

## 🔧 Разработка

### Backend

```bash
cd go-backend
pip install -r requirements.txt
uvicorn src.__main__:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd go-frontend
npm install
npm run dev
```

## 📡 API Endpoints

### Игры
- `POST /api/games/` - Создать игру
- `GET /api/games/{game_id}` - Получить игру
- `POST /api/games/{game_id}/move` - Сделать ход
- `POST /api/games/{game_id}/join` - Присоединиться к игре

### Игроки
- `POST /api/players/` - Создать игрока
- `GET /api/players/{telegram_id}` - Получить игрока

### Приглашения
- `POST /api/invites/` - Создать приглашение
- `GET /api/invites/{invite_id}` - Получить приглашение
- `POST /api/invites/{invite_id}/accept` - Принять приглашение
- `POST /api/invites/{invite_id}/decline` - Отклонить приглашение

## 🎯 Особенности

- **Real-time обновления** через HTTP polling
- **Telegram интеграция** для аутентификации
- **Валидация ходов** на сервере
- **Правила ГО** полностью реализованы
- **Масштабируемость** через Docker

## 🔒 Безопасность

- Валидация всех ходов на сервере
- Проверка прав доступа к играм
- Защита от повторных ходов
- Telegram WebApp безопасность

## 📱 Telegram WebApp

Приложение интегрировано с Telegram WebApp API:

- Автоматическая аутентификация через Telegram
- Настройка цветов и интерфейса
- Уведомления через Telegram Bot API

## 🚀 Деплой

### Production

1. Настройте переменные окружения для production
2. Используйте production базы данных
3. Настройте SSL сертификаты
4. Запустите с помощью Docker Compose

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Внесите изменения
4. Добавьте тесты
5. Создайте Pull Request

## 📄 Лицензия

MIT License

## 🆘 Поддержка

Если у вас есть вопросы или проблемы:

1. Создайте Issue в GitHub
2. Опишите проблему подробно
3. Приложите логи и скриншоты

---

**Удачной игры в ГО! 🎮** 