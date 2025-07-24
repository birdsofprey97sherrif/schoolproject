const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { auth, authorizeRoles } = require('../middlewares/authMiddleware');
// Route to add a new parent
router.post('/', auth, authorizeRoles('admin'), parentController.addParent);
// Route to get all parents
router.get('/', auth, parentController.getAllParents);
// Route to get a parent by ID
router.get('/:id', auth, parentController.getParentById);
// Route to update a parent by ID
router.put('/:id', auth, authorizeRoles('admin'), parentController.updateParent);
// Route to delete a parent by ID
router.delete('/:id', auth, authorizeRoles('admin'), parentController.deleteParent);
module.exports = router;