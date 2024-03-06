const userController = require('../controllers/user');
const userFreindsController = require('../controllers/userFriends');
const userPostsController = require('../controllers/userPosts');




const express = require('express');
var router = express.Router();


router.route('/')
    .post(userController.createUser);


router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)


//friends: 
router.route('/:id/friends')
    .get(userFreindsController.getUserFriends)
    .post(userFreindsController.addFriendReq)


router.route('/:id/friends/:fid')
    .patch(userFreindsController.acceptReq)
    .delete(userFreindsController.deleteFriend)


//posts: 
router.route('/:id/posts')
    .get(userPostsController.getUserPosts)
    .post(userPostsController.createPost)


router.route('/:id/posts/:pid')
    .patch(userPostsController.updatePost)
    .delete(userPostsController.deletePost)


module.exports = router;