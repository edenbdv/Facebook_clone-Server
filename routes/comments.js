
const commentsController = require('../controllers/comments');


const express = require('express');
var router = express.Router();


//comments:
router.route('/posts/:pid/comments')
    .get(commentsController.getComments)
    .post(commentsController.createComment)

router.route('/posts/:pid/comments/:cid')
    .patch(commentsController.updateComment)
    .delete(commentsController.deleteComment)  

module.exports = router;

