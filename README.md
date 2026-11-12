# Freelance Portfolio API — Express + MongoDB

Лабораторная работа №28 «Разработка простого API на Node.js/Express.js и подключение к MongoDB для хранения данных
веб-приложения». Вариант 1 — «Портфолио фриланс-разработчика», сущность **Project**.

Выполнил: Рахманкулов А., группа 310101.

## Стек

- Node.js, Express 5
- MongoDB + Mongoose
- dotenv (строка подключения в `.env`), nodemon (перезапуск при разработке)
- Postman / Newman (коллекция запросов в `postman/`)

## Mongoose-схема Project

| Поле | Тип | Валидация |
|---|---|---|
| `title` | String | **required**, trim, 3–100 символов |
| `description` | String | trim, до 1000 символов, по умолчанию `""` |
| `imageUrl` | String | URL `http(s)://...` или путь `/...`, по умолчанию `""` |
| `createdAt`, `updatedAt` | Date | добавляются автоматически (`timestamps: true`) |

## API

| Метод | URL | Назначение | Успех | Ошибки |
|---|---|---|---|---|
| GET | `/api/projects` | список всех проектов | 200 | 500 |
| GET | `/api/projects/:id` | один проект по ID | 200 | 400, 404, 500 |
| POST | `/api/projects` | создать проект | 201 | 400, 500 |
| PUT | `/api/projects/:id` | обновить проект | 200 | 400, 404, 500 |
| DELETE | `/api/projects/:id` | удалить проект | 200 | 400, 404, 500 |

Пример тела запроса POST / PUT:

```json
{
  "title": "Маркетплейс handmade-товаров",
  "description": "Каталог, корзина и кабинет мастера.",
  "imageUrl": "/assets/project-marketplace.svg"
}
```

## Установка и запуск

Нужен [Node.js](https://nodejs.org/) 18 или новее.

```bash
git clone https://github.com/guncahv/freelance-portfolio-api.git
cd freelance-portfolio-api
npm install
cp .env.example .env        # Windows: copy .env.example .env
```

**MongoDB.** В `.env` укажите строку подключения `MONGODB_URI`:

- установленный MongoDB или MongoDB Atlas — подставьте свою строку подключения;
- если MongoDB не установлена — запустите локальный сервер командой `npm run mongo`
  (пакет `mongodb-memory-server` скачает официальный `mongod` и запустит его на порту 27017,
  данные хранятся в папке `.mongo-data`). Окно с MongoDB не закрывайте.

**API:**

```bash
npm run dev     # разработка: nodemon перезапускает сервер при изменении файлов
npm start       # обычный запуск
```

Сервер: http://localhost:5000, эндпоинты: http://localhost:5000/api/projects

## Тестирование

Импортируйте в Postman файл `postman/freelance-portfolio-api.postman_collection.json`
(File → Import) и выполните запросы по порядку — POST сохраняет ID проекта в переменную `projectId`.

Та же коллекция запускается из консоли через Newman:

```bash
npm run test:api
```

## Структура проекта

```
config/db.js                    # подключение к MongoDB (Mongoose)
models/Project.js               # Mongoose-схема и модель Project
controllers/projectController.js# CRUD-логика (async/await + try...catch)
routes/projectRoutes.js         # маршруты /api/projects
middleware/errorHandler.js      # 404 и обработчик ошибок
scripts/local-mongo.js          # локальный MongoDB для разработки
postman/                        # коллекция запросов Postman
server.js                       # точка входа
.env.example                    # пример переменных окружения
```
