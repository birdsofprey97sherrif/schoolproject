const express = require('express')
const router = express.Router()
const assingmentController = require('../controllers/assingmentController')
const {auth,authorizeRoles}=require('../middlewares/authMiddleware')
router.post("/",auth,authorizeRoles("teacher"),assingmentController.addAssingment)
router.get("/",auth,assingmentController.getAllAssingment)
router.get("/:id",auth,assingmentController.getAssingmentById)
// router.put("/:id",auth,authorizeRoles("admin","teacher"), assingmentController.updateTeacher);
router.put("/:id",auth,authorizeRoles("admin","teacher"), assingmentController.updateAssingment);
router.delete("/:id",auth,authorizeRoles("teacher"), assingmentController.deleteAssingment);

module.exports=router