// אמצעי זיהוי ואימות גישה
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware לזיהוי משתמש באמצעות טוקן JWT
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization'); // קבלת הטוקן מהכותרת
  if (!token) return res.status(401).json({ error: { message: 'Unauthorized' } }); // טיפול במקרה שאין טוקן

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // אימות הטוקן
    req.user = await User.findById(decoded.id); // שמירת פרטי המשתמש בבקשה
    next(); // מעבר לשלב הבא
  } catch (err) {
    res.status(401).json({ error: { message: 'Invalid Token' } }); // טיפול במקרה של טוקן לא תקין
  }
};

// Middleware שמאפשר גישה רק למנהל
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: { message: 'Forbidden' } }); // טיפול במקרה של חוסר הרשאה
  }
  next(); // מעבר לשלב הבא
};

module.exports = { authenticate, adminOnly }; // ייצוא האמצעים
