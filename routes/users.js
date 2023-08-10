var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

// 모든 사용자 조회
router.get('/', userController.getUsers);

// 특정 사용자 조회
//router.get('/:id', userController.getUserById);
// create new user
router.post('/register', userController.createUser);

// 특정 사용자 ingredient 추가 업데이트
router.post('/addingredients', userController.addUserIngredients);

module.exports = router;
