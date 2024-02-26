const userController = require('../controllers/user');

const express = require('express');
var router = express.Router();


router.route('/')
    .post(userController.createUser);


router.route('/:id')
   .get(userController.getUser)

   .patch(userController.updateUserN) //update spesific field (username)
   .patch(userController.updatePass) //update spesific field (password)
   //.patch(userController.updateDisplay) //update spesific field (display name)
   //.patch(userController.updatePic) //update spesific field (profile pic)




   .delete(userController.deleteUser)

module.exports = router;