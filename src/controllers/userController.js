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
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // בדיקה אם המשתמש כבר קיים
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: { message: 'User already exists' } });

    // יצירת משתמש חדש
    const user = await User.create({ username, email, password });
    res.status(201).json({ username: user.username, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } }); // טיפול בשגיאות שרת
  }
};

// התחברות משתמש קיים
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }); // חיפוש משתמש לפי דוא"ל
    if (user && (await bcrypt.compare(password, user.password))) { // השוואת סיסמאות
      res.json({ username: user.username, token: generateToken(user._id) });
    } else {
      res.status(401).json({ error: { message: 'Invalid credentials' } }); // טיפול במקרה של פרטי התחברות לא תקינים
    }
  } catch (err) {
    res.status(500).json({ error: { message: err.message } }); // טיפול בשגיאות שרת
  }
};

// קבלת כל המשתמשים (מיועד למנהל בלבד)
const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // שליפת כל המשתמשים ממסד הנתונים
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } }); // טיפול בשגיאות שרת
  }
};

module.exports = { registerUser, loginUser, getUsers }; // ייצוא הפונקציות
