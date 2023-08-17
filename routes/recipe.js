var express = require('express');
var router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/mainrecipes', recipeController.getRecipes);

module.exports = router;
