const mongoose = require('mongoose');

/**
 * Подключение к MongoDB через Mongoose.
 * Строка подключения хранится в .env (MONGODB_URI) и передаётся из server.js.
 */
async function connectDB(uri) {
  if (!uri) {
    console.error('Не задана переменная MONGODB_URI. Создайте файл .env по образцу .env.example');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB подключена: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
  } catch (error) {
    console.error(`Ошибка подключения к MongoDB: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
