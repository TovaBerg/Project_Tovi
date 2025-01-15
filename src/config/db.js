// קובץ חיבור למסד הנתונים MongoDB
const mongoose = require('mongoose');

const connectDB = async (req, res, next) => {
  try {
    // ניסיון חיבור למסד הנתונים
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
    next(); // מעבר ל-Middleware הבא אם החיבור הצליח
  } catch (err) {
    // העברת השגיאה ל-Middleware לטיפול בשגיאות
    next(new Error('חיבור למסד הנתונים נכשל. בדוק את הגדרות ה-MongoDB שלך.'));
  }
};

module.exports = connectDB; // ייצוא הפונקציה לחיבור למסד הנתונים
