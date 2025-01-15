// ניתובים לפעולות שקשורות למשתמשים
const express = require('express');
const { registerUser, loginUser, getUsers } = require('../controllers/userController'); // ייבוא פונקציות של בקרת משתמשים
const { authenticate, adminOnly } = require('../middlewares/authMiddleware'); // ייבוא אמצעי זיהוי

const router = express.Router();

// ניתוב לרישום משתמש חדש
router.post('/register', registerUser);

// ניתוב להתחברות של משתמש
router.post('/login', loginUser);

// ניתוב לקבלת כל המשתמשים (מיועד למנהל בלבד)
router.get('/', authenticate, adminOnly, getUsers);

module.exports = router; // ייצוא הניתובים
