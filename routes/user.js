const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 회원가입
router.post('/register', userController.createUser);

// 로그인
router.post('/login', userController.login);

// 유저 재료 등록
router.post('/addingredients', userController.saveIngredients);

module.exports = router;
