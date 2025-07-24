const express = require('express')
const router = express.Router()
const adminDashboard = require('../controllers/adminDashboard')
const { auth, authorizeRoles } = require("../middlewares/authMiddleware");
router.get('/dashboard', auth, authorizeRoles('admin'), adminDashboard.getDashboardData);
module.exports = router;