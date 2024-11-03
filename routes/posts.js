
const postsController = require('../controllers/posts');
const likesController = require('../controllers/likes');

const express = require('express');
var router = express.Router();


router.route('/')
    .get(postsController.getPosts)

router.route('/:pid/likes')
    .get(likesController.getLikes)
    .post(likesController.likePost)
    .delete(likesController.unlikePost)

module.exports = router;