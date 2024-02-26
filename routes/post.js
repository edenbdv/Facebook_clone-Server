const postController = require('../controllers/post');

const express = require('express');
var router = express.Router();


router.route('/api/users/:id/posts')
    .get(postController.getPosts)
    .post(postController.createPost);

module.exports = router;