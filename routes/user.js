const userController = require('../controllers/user');
const userFriendsController = require('../controllers/userFriends');
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
    .get(userFriendsController.getUserFriends)
    .post(userFriendsController.addFriendReq)
    // .delete(userFriendsController.deleteFriendReq)

//friend requests
router.route('/:id/friends-requests')
    .get(userFriendsController.getFriendRequests)


router.route('/:id/friends/:fid')
    .patch(userFriendsController.acceptReq)
    .delete(userFriendsController.deleteFriend)


//posts: 
router.route('/:id/posts')
    .get(userPostsController.getUserPosts)
    .post(userPostsController.createPost)


router.route('/:id/posts/:pid')
    .patch(userPostsController.updatePost)
    .delete(userPostsController.deletePost)




module.exports = router;