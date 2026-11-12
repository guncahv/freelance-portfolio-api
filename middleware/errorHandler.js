// 404 — маршрут не найден
function notFound(req, res) {
  res.status(404).json({ message: `Маршрут не найден: ${req.method} ${req.originalUrl}` });
}

// Общий обработчик ошибок: некорректный JSON в теле → 400, остальное → 500
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Некорректный JSON в теле запроса' });
  }
  console.error(err);
  return res.status(500).json({ message: 'Ошибка сервера', error: err.message });
}

module.exports = { notFound, errorHandler };
