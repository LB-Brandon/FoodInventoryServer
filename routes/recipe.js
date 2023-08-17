var express = require('express');
var router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/mainrecipes', recipeController.getRecipes);

router.get('/imagetest', recipeController.getImageUrl('chicken'));

module.exports = router;
