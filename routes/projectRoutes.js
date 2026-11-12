const express = require('express');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const router = express.Router();

// /api/projects
router.route('/').get(getProjects).post(createProject);

// /api/projects/:id
router.route('/:id').get(getProjectById).put(updateProject).delete(deleteProject);

module.exports = router;
