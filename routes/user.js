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
router.get('/ingredients', userController.getUserIngredients);

// 유저 재료 삭제
router.post('/deleteingredient', userController.deleteUserIngredients);

// 가진 재료, 없는 재료 조회
router.get('/seewhatyougot', userController.seeWhatYouGot);

module.exports = router;
