var express = require('express');
var router = express.Router();
var openAIAPIController = require('../controllers/openAIAPIController');

/* GET home page. */
router.get('/', openAIAPIController.getRecipes);

module.exports = router;
