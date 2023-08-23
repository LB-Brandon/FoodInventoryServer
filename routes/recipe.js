var express = require('express');
var router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/mainrecipes', recipeController.getRecipes);

router.get('/subrecipes', recipeController.getSubRecipes);
// 가진 재료, 없는 재료 조회
router.get('/seewhatyougot', recipeController.seeWhatYouGot);

module.exports = router;
