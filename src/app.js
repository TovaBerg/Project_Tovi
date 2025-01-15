// נקודת הכניסה הראשית של האפליקציה
const express = require('express');
const dotenv = require('dotenv'); // טעינת משתנים מתוך קובץ .env
const connectDB = require('./config/db'); // חיבור למסד הנתונים
const userRoutes = require('./routes/userRoutes'); // ניתובים שקשורים למשתמשים
const errorHandler = require('./middlewares/errorMiddleware'); // טיפול בשגיאות
//const recipeRoutes = require('./routes/recipeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');


// טעינת משתני סביבה
dotenv.config();

// חיבור למסד הנתונים
 connectDB();

const app = express();

// Middleware לקריאת בקשות בפורמט JSON
app.use(express.json());

// הגדרת ניתובים לפי ישויות
app.use('/api/users', userRoutes);
//app.use('/api/recipes', recipeRoutes);
app.use('/api/categories', categoryRoutes);

// Middleware לטיפול בשגיאות
app.use(errorHandler);

// הפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
