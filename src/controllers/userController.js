// פונקציות בקרת משתמשים
const User = require('../models/User'); // ייבוא מודל המשתמשים
const jwt = require('jsonwebtoken'); // ספרייה ליצירת JSON Web Tokens

// פונקציה ליצירת טוקן JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // זמן תוקף הטוקן
  });
};

// רישום משתמש חדש
const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // בדיקה אם המשתמש כבר קיים
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error('User already exists');
      error.statusCode = 400; // סטטוס 400 - בקשה לא חוקית
      return next(error); // העברת השגיאה לטיפול
    }

    // יצירת משתמש חדש
    const user = await User.create({ username, email, password });

    // תגובה עם פרטי המשתמש והטוקן
    res.status(201).json({ username: user.username, token: generateToken(user._id) });
  } catch (err) {
    next(err); // העברת השגיאה לטיפול ב-Error Handler
  }
};


// התחברות משתמש קיים
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // חיפוש משתמש לפי דוא"ל
    const user = await User.findOne({ email });

    // בדיקת פרטי ההתחברות
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ username: user.username, token: generateToken(user._id) });
    } else {
      const error = new Error('Invalid credentials'); // שגיאה עבור פרטי התחברות שגויים
      error.statusCode = 401; // סטטוס 401 - גישה לא מורשית
      return next(error); // העברת השגיאה לטיפול
    }
  } catch (err) {
    next(err); // העברת השגיאה לטיפול ב-Error Handler
  }
};


// קבלת כל המשתמשים (מיועד למנהל בלבד)
const getUsers = async (req, res, next) => {
  try {
    // שליפת כל המשתמשים ממסד הנתונים
    const users = await User.find();

    // החזרת המשתמשים בתגובה
    res.json(users);
  } catch (err) {
    next(err); // העברת השגיאה לטיפול ב-Error Handler
  }
};


module.exports = { registerUser, loginUser, getUsers }; // ייצוא הפונקציות
