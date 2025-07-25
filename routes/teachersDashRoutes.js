const express = require('express')
const router = express.Router()
const TeachersDashboard = require('../controllers/teachersDashController')
const { auth, authorizeRoles } = require("../middlewares/authMiddleware");
router.get('/', auth, authorizeRoles('teacher'), TeachersDashboard.getTeachersDashboard);

module.exports = router;