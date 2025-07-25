const express = require('express')
const router = express.Router()
const parentDashboard = require('../controllers/parentDashController')
const { auth, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/new",auth, authorizeRoles("parent"), parentDashboard.ParentDashboard);
router.get("/", auth, authorizeRoles("parent"), parentDashboard.getClassAssingments); // Get parent dashboard
module.exports = router;