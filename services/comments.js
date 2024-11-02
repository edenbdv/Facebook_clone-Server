const CommentModel = require('../models/comment');
const PostModel = require('../models/post');
const UserService = require('../services/user');
const userPostsService = require('../services/userPosts');


const createComment = async (creatorUsername, text, postId) => {
    try {

         // Fetch the user by username to get their ID
         const creatorUser = await UserService.getUserByUsername(creatorUsername);
         if (!creatorUser) {
             throw new Error(`User with username ${creatorUsername} not found`);
         }

        const comment = new CommentModel({ text: text, postId: postId, createdBy:creatorUsername})
        const savedComment = await comment.save();

        // Update the post's comment list with the newly created post ID
        await PostModel.findByIdAndUpdate(postId, { $push: { comments: savedComment._id } });


        return savedComment;
    } catch (error) {

        console.log('Error creating Comment:', error);

        throw error; 
    }
};


const getDataCommentByCid = async (commentId) => {
    try {
        const comment = await CommentModel.findById(commentId);

        let commentData = {
            commentId: commentId,
            text: comment.text,
            postId: comment.postId,
            createdBy: comment.createdBy,
            createdAt: comment.createdAt
        };

        return commentData;
    } catch (error) {
        throw new Error('Error fetching comment by cid: ' + error.message);
    }
};


const getComments = async (postId) => {

    try {
        const post = await userPostsService.getPostById(postId);

        if (!post) {
            throw new Error(`Post with ID ${postId} not found`);
        }

        const comments = post.comments;
        const commentsData = []
        for (const commentId of comments) {
          const commentData = await getDataCommentByCid(commentId)
          commentsData.push(commentData)
        }

        return commentsData;

    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error; 
    }

};


const updateComment = async (commentId, text) => {

    // if (fieldName == 'text') {
    // const urls = extractUrls(fieldValue);
    // await checkUrlsInBlacklist(urls);
    // }

    try {
        const updatedComment = await CommentModel.findByIdAndUpdate(
            commentId, { text }, { new: true });

         // Check if the createdAt field has not changed
         if (updatedComment && updatedComment.createdAt) {
            return updatedComment; 

        } else {
            console.log('Error: createdAt field is missing or null');
        }
        return updatedComment; 

    } catch (error) {
        console.error("Error updating comment:", error);
        throw new Error('Failed to update comment');
    }
};


const deleteComment = async (postId, commentId ) => {
    try {
    
        if ( !postId) {
            throw new Error(`Comment ID not provided`);
        }

        const deletedComment = await CommentModel.findById(commentId);
        await CommentModel.findByIdAndDelete(commentId);
        await PostModel.updateOne({ _id: postId }, { $pull: { comments: commentId } });

        return deletedComment ;


    } catch (error) {
        console.error('Error deleting comment:', error);
        throw new Error('Internal Server Error');
    }
};

module.exports = { createComment, getComments, getDataCommentByCid, updateComment, deleteComment};