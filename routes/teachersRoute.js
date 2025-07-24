const express = require('express')
const router = express.Router()
const teacherController = require('../controllers/teacherController')
const {auth,authorizeRoles}=require('../middlewares/authMiddleware')
router.post("/",auth,authorizeRoles("admin"),teacherController.addTeacher)
router.get("/",auth,teacherController.getAllTeachers)
router.get("/:id",auth,teacherController.getTeacherbyId)
// router.put("/:id",auth,authorizeRoles("admin","teacher"), teacherController.updateTeacher);
router.put("/:id",auth,authorizeRoles("admin","teacher"), teacherController.updateProfile);
router.delete("/:id",auth,authorizeRoles("admin"), teacherController.deleteTeacher);

module.exports=router