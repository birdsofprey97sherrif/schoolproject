const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// authorization middleware
const { auth, authorizeRoles } = require("../middlewares/authMiddleware");
router.post('/create', auth, authorizeRoles('admin'), studentController.uploadStudentPhoto, studentController.createStudent);
router.get('/getAll', auth, authorizeRoles('admin', 'teacher'), studentController.getAllStudents);
router.get('/getById/:id', auth, authorizeRoles('admin', 'teacher'), studentController.getStudentById);
router.put('/update/:id', auth, authorizeRoles('admin'), studentController.uploadStudentPhoto, studentController.updateStudent);
router.delete('/delete/:id', auth, authorizeRoles('admin'), studentController.deleteStudent);
// router.get('/getByClassroom/:classroomId', auth, authorizeRoles('admin', 'teacher'), studentController.getStudentsByClassroom);
module.exports = router;