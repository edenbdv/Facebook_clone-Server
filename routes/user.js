const userController = require('../controllers/user');
const userFreindsController = require('../controllers/userFriends');


const express = require('express');
var router = express.Router();


router.route('/')
    .post(userController.createUser);


router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

router.route('/:id/friends')
    .get(userFreindsController.getUserFriends)
    .post(userFreindsController.addFriendReq)


router.route('/:id/friends/:fid')
    .patch(userFreindsController.acceptReq)
    // .delete(userController.cancelReq)   //need to check what need to do here - asked in forum



module.exports = router;