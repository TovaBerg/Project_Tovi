const Recipe = require('../models/Recipe'); // ייבוא מודל המשתמשים

// קבלת כל המתכונים (עם אפשרות חיפוש וסינון)
export const getRecipes = async (req, res) => {
    try {
      const { search, maxPrepTime, limit, page } = req.query;
  
      // הגדרת מסננים
      const filter = {
        $or: [
          { isPrivate: false }, // מתכונים ציבוריים
          { user: req.user._id }, // מתכונים פרטיים של המשתמש המחובר
        ],
        ...(search && { name: { $regex: search, $options: 'i' } }), // חיפוש טקסט חופשי
        ...(maxPrepTime && { prepTime: { $lte: Number(maxPrepTime) } }), // זמן הכנה
      };
  
      const options = {
        limit: Number(limit) || 10, // הגבלת כמות תוצאות
        skip: ((Number(page) || 1) - 1) * (Number(limit) || 10), // דילוג לפי עמודים
      };
  
      const recipes = await Recipe.find(filter, null, options).populate('category');
      res.json(recipes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}
  
  // קבלת פרטי מתכון לפי קוד
  export const getDetails= async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id).populate('category');
      if (!recipe) {
        return res.status(404).json({ message: 'מתכון לא נמצא' });
      }
      // ודא שהמשתמש יכול לגשת למתכון פרטי
      if (recipe.isPrivate && recipe.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'אין לך גישה למתכון הזה' });
      }
      res.json(recipe);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // קבלת מתכונים לפי זמן הכנה
  export const getTime= async (req, res) => {
    const { maxPrepTime } = req.query;
    try {
      const recipes = await Recipe.find({
        prepTime: { $lte: Number(maxPrepTime) },
        $or: [
          { isPrivate: false },
          { user: req.user._id },
        ],
      });
      res.json(recipes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // הוספת מתכון חדש
  export const addRecipe= async (req, res) => {
    try {
      const { name, description, category, prepTime, difficulty, isPrivate, layers, instructions, image } = req.body;
  
      const recipe = new Recipe({
        name,
        description,
        category,
        prepTime,
        difficulty,
        isPrivate,
        layers,
        instructions,
        image,
        user: req.user._id, // המשתמש שמוסיף את המתכון
      });
  
      await recipe.save();
      res.status(201).json(recipe);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // עדכון מתכון
  export const updateRecipe= async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: 'מתכון לא נמצא' });
      }
      // ודא שהמשתמש יכול לעדכן את המתכון
      if (recipe.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'אין לך גישה לעדכן את המתכון הזה' });
      }
  
      Object.assign(recipe, req.body);
      await recipe.save();
      res.json(recipe);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // מחיקת מתכון
  export const deleteRecipe= async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: 'מתכון לא נמצא' });
      }
      // ודא שהמשתמש יכול למחוק את המתכון
      if (recipe.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'אין לך גישה למחוק את המתכון הזה' });
      }
  
      await recipe.remove();
      res.json({ message: 'מתכון נמחק בהצלחה' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  module.exports = { };
