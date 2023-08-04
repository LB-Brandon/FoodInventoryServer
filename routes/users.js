var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

// 사용자 생성
router.post('/users', userController.createUser);

// 모든 사용자 조회
router.get('/', userController.getUsers);

module.exports = router;
