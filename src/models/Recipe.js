const mongoose = require('mongoose');

// סכמת מתכונים
const recipeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'חובה לספק שם למתכון'], // שם חובה
      trim: true, // מסיר רווחים מיותרים
    },
    description: {
      type: String,
      required: [true, 'חובה לספק תיאור למתכון'], // תיאור חובה
      maxlength: [500, 'תיאור לא יכול לעלות על 500 תווים'], // מגבלת אורך
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // קשר גומלין לקטגוריות
      ref: 'Category', // שם המודל לקטגוריות
      required: [true, 'חובה לבחור קטגוריה'], // קטגוריה חובה
    },
    prepTime: {
      type: Number,
      required: [true, 'חובה לציין זמן הכנה'], // זמן הכנה חובה
      min: [1, 'זמן הכנה חייב להיות לפחות דקה אחת'], // מגבלה מינימלית
    },
    difficulty: {
      type: Number,
      required: [true, 'חובה לציין רמת קושי'], // רמת קושי חובה
      min: [1, 'רמת קושי לא יכולה להיות קטנה מ-1'], // רמת קושי מינימלית
      max: [5, 'רמת קושי לא יכולה להיות גדולה מ-5'], // רמת קושי מקסימלית
    },
    isPrivate: {
      type: Boolean,
      default: false, // ברירת מחדל: מתכון ציבורי
    },
    layers: [
      {
        description: {
          type: String,
          required: [true, 'חובה לתאר שכבה'], // תיאור שכבה חובה
        },
        ingredients: {
          type: [String], // רשימת מרכיבים
          required: [true, 'חובה לציין מרכיבים לשכבה'], // חובה להוסיף מרכיבים
        },
      },
    ],
    instructions: {
      type: String,
      required: [true, 'חובה לציין הוראות הכנה'], // הוראות חובה
    },
    image: {
      type: String,
      default: '', // ניתן להשאיר ריק, ללא תמונה
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // קשר גומלין למשתמש
      ref: 'User', // שם המודל למשתמשים
      required: [true, 'חובה לשייך את המתכון למשתמש'], // חובה לציין את המשתמש
    },
    createdAt: {
      type: Date,
      default: Date.now, // תאריך ברירת מחדל: עכשיו
    },
  },
  {
    timestamps: true, // מוסיף createdAt ו-updatedAt אוטומטית
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);


