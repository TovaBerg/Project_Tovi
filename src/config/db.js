// קובץ חיבור למסד הנתונים MongoDB
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // חיבור למסד הנתונים עם URI מתוך משתני הסביבה
    await mongoose.connect(process.env.MONGO_URI); // אין צורך בפרמטרים הישנים
    console.log('MongoDB Connected...'); // הודעה במקרה של הצלחה
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`); // הודעת שגיאה מפורטת
    process.exit(1); // יציאה מהתהליך עם שגיאה
  }
};

module.exports = connectDB; // ייצוא הפונקציה לחיבור למסד הנתונים
