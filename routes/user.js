const userController = require('../controllers/user');

const express = require('express');
var router = express.Router();


router.route('/')
    .post(userController.createUser);


router.route('/:id')
//    .get(userController.getArticle)
//    .patch(userController.updateArticle) //update spesific field (title)
//    .delete(userController.deleteArticle)

module.exports = router;