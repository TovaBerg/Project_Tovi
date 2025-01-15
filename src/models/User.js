// מודל משתמש עבור MongoDB
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // ספרייה להצפנת סיסמאות

// סכימה של משתמש עבור אוסף המשתמשים
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // שם משתמש ייחודי
  password: { type: String, required: true }, // סיסמה מוצפנת
  email: { type: String, required: true, unique: true, Math: "email" }, // דוא"ל ייחודי
  address: { type: String }, // כתובת (אופציונלי)
  role: { type: String, enum: ['admin', 'registered', 'guest'], default: 'guest' }, // תפקיד המשתמש עם ערך ברירת מחדל
});

// פעולה שמתבצעת לפני שמירת המשתמש - הצפנת סיסמה
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // אם הסיסמה לא שונתה, דלג
  this.password = await bcrypt.hash(this.password, 10); // הצפנת הסיסמה
  next();
});

module.exports = mongoose.model('User', userSchema); // ייצוא המודל של המשתמש
