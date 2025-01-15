// Middleware לטיפול בשגיאות
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // אם הסטטוס לא הוגדר, השתמש ב-500
  res.status(statusCode);
  res.json({
    error: {
      message: err.message, // הודעת השגיאה
      stack: process.env.NODE_ENV === 'production' ? null : err.stack, // ערימת השגיאות רק אם לא ב-production
    },
  });
};

module.exports = errorHandler;
