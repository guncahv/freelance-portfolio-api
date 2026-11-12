/**
 * Локальный сервер MongoDB для разработки (если MongoDB не установлена на компьютере).
 * Пакет mongodb-memory-server скачивает официальный бинарный файл mongod и запускает его
 * на порту 27017. Данные сохраняются в папке .mongo-data, поэтому не пропадают после перезапуска.
 * Запуск: npm run mongo
 */
const path = require('path');
const fs = require('fs');
const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  const dbPath = path.join(__dirname, '..', '.mongo-data');
  fs.mkdirSync(dbPath, { recursive: true });

  const mongod = await MongoMemoryServer.create({
    instance: { port: 27017, dbPath, storageEngine: 'wiredTiger' },
  });

  console.log(`MongoDB запущена: ${mongod.getUri()}`);
  console.log('Не закрывайте это окно, пока работает API. Остановка: Ctrl+C');

  const stop = async () => {
    await mongod.stop({ doCleanup: false });
    process.exit(0);
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
})();
