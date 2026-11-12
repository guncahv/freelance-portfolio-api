// Точка входа: Express-сервер REST API портфолио фриланс-разработчика (ЛР №28).
require('dotenv').config(); // читает переменные из файла .env в process.env

const express = require('express');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/projectRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// разбор JSON в теле запроса (req.body)
app.use(express.json());

// простой журнал запросов: метод, URL, код ответа и время обработки
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - start} ms)`);
  });
  next();
});

// проверка, что сервер запущен
app.get('/', (req, res) => {
  res.json({ message: 'Freelance Portfolio API работает', endpoints: '/api/projects' });
});

// CRUD-маршруты сущности «Проект»
app.use('/api/projects', projectRoutes);

// 404 для неизвестных маршрутов и общий обработчик ошибок
app.use(notFound);
app.use(errorHandler);

// сервер начинает принимать запросы только после подключения к MongoDB
async function start() {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));
}

start();
