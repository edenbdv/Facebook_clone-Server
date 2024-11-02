const commentsService = require('../services/comments');
const tokenService = require('../services/token');


const createComment = async (req, res) => {
    try {

        const { text } = req.body;
        const postId = req.params.pid;

        // Extract the token from the request headers
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token using the token service
        const loggedUsername = await tokenService.verifyToken(token);

        const newComment = await commentsService.createComment(loggedUsername, text, postId);
        res.status(201).json(newComment); // Respond with the created comment
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const getComments = async (req, res) => {
    try {

        const postId = req.params.pid;
        const comments = await commentsService.getComments(postId);

        res.json(comments);
        
    } catch (error) {
        console.error('Error getting comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const updateComment = async (req, res) => {

    try {
        const commentId = req.params.cid;
        const { text } = req.body;

        const commentData = await commentsService.getDataCommentByCid(commentId);

        if (!commentData) {
            return res.status(404).json({ errors: ['Comment not found'] });
        }


        // Extract the token from the request headers
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token using the token service
        const loggedUsername = await tokenService.verifyToken(token);

        // Check if the user is authorized to perform the update
        if (commentData.createdBy !== loggedUsername) {
            // console.log('User is not authorized to update this post')
            return res.status(403).json({ errors: ['User is not authorized to update this post'] });
        }

    
        const updateComment = await commentsService.updateComment(commentId, text);

        if (!updateComment) {
            return res.status(404).json({ errors: ['Comment not found'] });
        }

        res.json(updateComment);
    } catch (error) {

        console.error("Error updating comment:", error);

        // if (error.message === `forbidden url was found. `) {
        //     return res.status(403).json({ error: error.message });
        // }
        
        res.status(500).json({ errors: ['Failed to update comment'] });
    }
}

const deleteComment = async (req, res) => {
    try {

        const postId = req.params.pid;
        const commentId = req.params.cid;
        const commentData = await commentsService.getDataCommentByCid(commentId);

        // Extract the token from the request headers
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token using the token service
        const loggedUsername = await tokenService.verifyToken(token);

        // Check if the user is authorized to perform the update
        if (commentData.createdBy !== loggedUsername) {
            return res.status(403).json({ errors: ['User is not authorized to update this post'] });
        }

        res.json(await commentsService.deleteComment(postId, commentId));

    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




module.exports = {createComment, getComments, updateComment, deleteComment }