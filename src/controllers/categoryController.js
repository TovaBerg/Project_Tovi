
const Category = require('../models/Category'); // ייבוא מודל המשתמשים

// קבלת כל הקטגוריות
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories); // החזרת הקטגוריות בתגובה
  } catch (err) {
    next(err); // העברת השגיאה לטיפול ב-Error Handler
  }
};

// קבלת קטגוריה לפי קוד (או שם) וכל המתכונים בקטגוריה
const getCategoriesById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      // במקרה שקטגוריה לא נמצאה
      const error = new Error('קטגוריה לא נמצאה');
      error.statusCode = 404; // קוד סטטוס מותאם
      return next(error); // העברת השגיאה לטיפול
    }

    const recipes = await Recipe.find({ category: category._id });
    res.json({ category, recipes }); // החזרת הקטגוריה והמתכונים בתגובה
  } catch (err) {
    next(err); // העברת השגיאה לטיפול ב-Error Handler
  }
};

module.exports = {getCategories,getCategoriesById};

