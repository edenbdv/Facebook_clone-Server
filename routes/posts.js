
const postsController = require('../controllers/posts');


const express = require('express');
var router = express.Router();


router.route('/')
    .get(postsController.getPosts);


module.exports = router;