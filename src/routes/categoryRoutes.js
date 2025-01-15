const express = require('express');
const {getCategories,getCategoriesById} = require('../controllers/categoryController'); // מודל קטגוריות

const router = express.Router();

// קבלת כל הקטגוריות
router.get('/', getCategories);

// קבלת קטגוריה לפי קוד (או שם) וכל המתכונים בקטגוריה
router.get('/:id', getCategoriesById);

module.exports = router;

