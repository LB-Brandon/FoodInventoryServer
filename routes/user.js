const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 회원가입
router.post('/signup', userController.signUp);

// 로그인
router.post('/login', userController.login);

// 유저 재료 등록
router.post('/addingredients', userController.saveIngredients);

// 유저 재료 조회
router.get('/useringredients', userController.getUserIngredients);

module.exports = router;
