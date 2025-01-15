const Recipe = require('../models/Recipe'); // ייבוא מודל המשתמשים

// קבלת כל המתכונים (עם אפשרות חיפוש וסינון)
export const getRecipes = async (req, res, next) => {
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
    res.json(recipes); // החזרת המתכונים בתגובה
  } catch (err) {
    next(err); // העברת השגיאה לטיפול ב-Error Handler
  }
};

  
  // קבלת פרטי מתכון לפי קוד
  export const getDetails = async (req, res, next) => {
    try {
      const recipe = await Recipe.findById(req.params.id).populate('category');
      if (!recipe) {
        // אם המתכון לא נמצא, יוצרים שגיאה חדשה
        const error = new Error('מתכון לא נמצא');
        error.statusCode = 404; // סטטוס 404 - לא נמצא
        return next(error); // העברת השגיאה לטיפול
      }
  
      // בדיקה אם למשתמש יש גישה למתכון פרטי
      if (recipe.isPrivate && recipe.user.toString() !== req.user._id.toString()) {
        const error = new Error('אין לך גישה למתכון הזה');
        error.statusCode = 403; // סטטוס 403 - גישה אסורה
        return next(error); // העברת השגיאה לטיפול
      }
  
      res.json(recipe); // החזרת המתכון בתגובה
    } catch (err) {
      next(err); // העברת השגיאה לטיפול ב-Error Handler
    }
  };
  

  
  // קבלת מתכונים לפי זמן הכנה
  export const getTime = async (req, res, next) => {
    const { maxPrepTime } = req.query;
    try {
      const recipes = await Recipe.find({
        prepTime: { $lte: Number(maxPrepTime) },
        $or: [
          { isPrivate: false }, // מתכונים ציבוריים
          { user: req.user._id }, // מתכונים פרטיים של המשתמש המחובר
        ],
      });
  
      res.json(recipes); // החזרת המתכונים המתאימים בתגובה
    } catch (err) {
      next(err); // העברת השגיאה לטיפול ב-Error Handler
    }
  };
  
  
  // הוספת מתכון חדש
  export const addRecipe = async (req, res, next) => {
    try {
      const { 
        name, 
        description, 
        category, 
        prepTime, 
        difficulty, 
        isPrivate, 
        layers, 
        instructions, 
        image 
      } = req.body;
  
      // יצירת אובייקט מתכון חדש
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
  
      // שמירת המתכון במסד הנתונים
      await recipe.save();
  
      // החזרת תגובה עם סטטוס 201 והמתכון החדש
      res.status(201).json(recipe);
    } catch (err) {
      next(err); // העברת השגיאה לטיפול ב-Error Handler
    }
  };
  
  
  // עדכון מתכון
  export const updateRecipe = async (req, res, next) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
  
      if (!recipe) {
        // אם המתכון לא נמצא
        const error = new Error('מתכון לא נמצא');
        error.statusCode = 404; // סטטוס 404 - לא נמצא
        return next(error); // העברת השגיאה לטיפול
      }
  
      // בדיקה אם למשתמש יש גישה לעדכן את המתכון
      if (recipe.user.toString() !== req.user._id.toString()) {
        const error = new Error('אין לך גישה לעדכן את המתכון הזה');
        error.statusCode = 403; // סטטוס 403 - גישה אסורה
        return next(error); // העברת השגיאה לטיפול
      }
  
      // עדכון פרטי המתכון
      Object.assign(recipe, req.body);
      await recipe.save();
  
      // החזרת המתכון המעודכן בתגובה
      res.json(recipe);
    } catch (err) {
      next(err); // העברת השגיאה לטיפול ב-Error Handler
    }
  };
  
  // מחיקת מתכון
  export const deleteRecipe = async (req, res, next) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
  
      if (!recipe) {
        // אם המתכון לא נמצא
        const error = new Error('מתכון לא נמצא');
        error.statusCode = 404; // סטטוס 404 - לא נמצא
        return next(error); // העברת השגיאה לטיפול
      }
  
      // בדיקה אם למשתמש יש גישה למחוק את המתכון
      if (recipe.user.toString() !== req.user._id.toString()) {
        const error = new Error('אין לך גישה למחוק את המתכון הזה');
        error.statusCode = 403; // סטטוס 403 - גישה אסורה
        return next(error); // העברת השגיאה לטיפול
      }
  
      // מחיקת המתכון
      await recipe.remove();
  
      // תגובה על מחיקה מוצלחת
      res.json({ message: 'מתכון נמחק בהצלחה' });
    } catch (err) {
      next(err); // העברת השגיאה לטיפול ב-Error Handler
    }
  };
  
  

  module.exports = { };
