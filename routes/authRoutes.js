const express = require('express');
const router = express.Router();
// Ensure loginUser is imported from your controller
const { registerUser, loginUser } = require('../controllers/authController'); 

router.post('/register', registerUser);
router.post('/login', loginUser); // Add this line

module.exports = router;