const mongoose = require('mongoose');

// סכמת קטגוריות
const categorySchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'חובה לספק קוד לקטגוריה'], // חובה
      unique: true, // הקוד חייב להיות ייחודי
      trim: true, // מסיר רווחים מיותרים
      maxlength: [10, 'אורך הקוד לא יכול לעלות על 10 תווים'], // מגבלת אורך
    },
    description: {
      type: String,
      required: [true, 'חובה לספק תיאור לקטגוריה'], // חובה
      maxlength: [100, 'התיאור לא יכול לעלות על 100 תווים'], // מגבלת אורך
    },
    recipesCount: {
      type: Number,
      default: 0, // ברירת מחדל: 0 מתכונים בקטגוריה
      min: [0, 'מספר המתכונים לא יכול להיות שלילי'], // מגבלה מינימלית
    },
  },
  {
    timestamps: true, // מוסיף createdAt ו-updatedAt אוטומטית
  }
);

// יצירת מודל
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
