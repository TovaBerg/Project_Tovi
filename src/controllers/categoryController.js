
const Category = require('../models/Category'); // ייבוא מודל המשתמשים

// קבלת כל הקטגוריות
const getCategories= async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// קבלת קטגוריה לפי קוד (או שם) וכל המתכונים בקטגוריה
const getCategoriesById= async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'קטגוריה לא נמצאה' });
    }
    const recipes = await Recipe.find({ category: category._id });
    res.json({ category, recipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {getCategories,getCategoriesById};

