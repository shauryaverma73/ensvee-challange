const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');


router.post('/signUp', userController.signUp);
router.post('/login', userController.login);
router.get('/logout', authController.protect, userController.logout);
router.get('/getUser/:id', authController.protect, userController.getUser);

module.exports = router;