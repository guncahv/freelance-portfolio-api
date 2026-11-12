const mongoose = require('mongoose');
const Project = require('../models/Project');

// Поля, которые клиент может задавать (остальные игнорируются).
const ALLOWED_FIELDS = ['title', 'description', 'imageUrl'];

function pickFields(body = {}) {
  return Object.fromEntries(Object.entries(body).filter(([key]) => ALLOWED_FIELDS.includes(key)));
}

// Некорректный ObjectId → сразу 400, без запроса к базе.
function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Ошибки валидации Mongoose → 400 с перечнем полей.
function validationErrorResponse(res, error) {
  const errors = Object.fromEntries(Object.entries(error.errors).map(([field, err]) => [field, err.message]));
  return res.status(400).json({ message: 'Ошибка валидации', errors });
}

/** GET /api/projects — получение списка всех проектов (новые сверху). */
async function getProjects(req, res) {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
}

/** GET /api/projects/:id — получение одного проекта по ID. */
async function getProjectById(req, res) {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ message: `Некорректный ID: ${id}` });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' });
    }
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
}

/** POST /api/projects — создание нового проекта. */
async function createProject(req, res) {
  try {
    const project = await Project.create(pickFields(req.body));
    return res.status(201).json(project);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return validationErrorResponse(res, error);
    }
    return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
}

/** PUT /api/projects/:id — обновление существующего проекта. */
async function updateProject(req, res) {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ message: `Некорректный ID: ${id}` });
  }

  const update = pickFields(req.body);
  if (Object.keys(update).length === 0) {
    return res.status(400).json({ message: 'Нет полей для обновления (title, description, imageUrl)' });
  }

  try {
    const project = await Project.findByIdAndUpdate(id, update, {
      returnDocument: 'after', // вернуть документ после обновления
      runValidators: true, // проверить данные по схеме и при обновлении
    });
    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' });
    }
    return res.status(200).json(project);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return validationErrorResponse(res, error);
    }
    return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
}

/** DELETE /api/projects/:id — удаление проекта. */
async function deleteProject(req, res) {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ message: `Некорректный ID: ${id}` });
  }

  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' });
    }
    return res.status(200).json({ message: 'Проект удалён', id: project._id });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
}

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };
