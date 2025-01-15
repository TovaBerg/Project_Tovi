const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // Middleware לאימות משתמש
const {getRecipes, getDetails, getTime,addRecipe,updateRecipe,deleteRecipe}= require('../controllers/recipeController')
// קבלת כל המתכונים (עם אפשרות חיפוש וסינון)


router.get('/', getRecipes);

// קבלת פרטי מתכון לפי קוד
router.get('/:id',getDetails);

// קבלת מתכונים לפי זמן הכנה
router.get('/filter/preptime', getTime);

// הוספת מתכון חדש
router.post('/', addRecipe);

// עדכון מתכון
router.put('/:id', updateRecipe);

// מחיקת מתכון
router.delete('/:id', deleteRecipe);

module.exports = router;

