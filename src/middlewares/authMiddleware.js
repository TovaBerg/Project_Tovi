// אמצעי זיהוי ואימות גישה
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware לזיהוי משתמש באמצעות טוקן JWT
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization'); // קבלת הטוקן מהכותרת
  if (!token) {
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    return next(error); // העברת השגיאה ל-errorHandler
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // אימות הטוקן
    req.user = await User.findById(decoded.id); // שמירת פרטי המשתמש בבקשה
    next(); // מעבר לשלב הבא
  } catch (err) {
    const error = new Error('Invalid Token');
    error.statusCode = 401;
    next(error); // העברת השגיאה ל-errorHandler
  }
};

// Middleware שמאפשר גישה רק למנהל
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    return next(error); // העברת השגיאה ל-errorHandler
  }
  next(); // מעבר לשלב הבא
};

module.exports = { authenticate, adminOnly };
