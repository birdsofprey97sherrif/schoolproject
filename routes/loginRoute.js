const express = require('express')
const router = express.Router()
const loginController = require('../controllers/loginController')
router.post("/register",loginController.registerAdmin)
router.post("/",loginController.login)
module.exports = router