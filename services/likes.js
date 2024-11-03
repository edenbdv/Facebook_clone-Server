const PostModel = require('../models/post');
const UserService = require('../services/user');

const getLikes  = async (postId) => {
    try {

         const post = await PostModel.findById(postId);
         if (!post) {
             throw new Error(`Post with ID ${postId} not found`);
         }

         return post.likes; 
    
    } catch (error) {
        console.log('Error getting likes: ', error);
        throw error; 
    }
};

const likePost  = async (likerUsername, postId) => {
    try {

         // Fetch the user by username to get their ID
         const likerUser = await UserService.getUserByUsername(likerUsername);
         if (!likerUser) {
             throw new Error(`User with username ${likerUsername} not found`);
         }

         const post = await PostModel.findById(postId);
         if (!post) {
             throw new Error(`Post with ID ${postId} not found`);
         }
 
         // Check if the user is already in the likes array
         if (!post.likes.includes(likerUsername)) {
            // Add the liker's username to the post's likes
            const updatedPost = await PostModel.findByIdAndUpdate(
                postId,
                { $addToSet: { likes: likerUsername } },
                { new: true }
            );

            return updatedPost.likes; 
        } else {
            console.log(`User ${likerUsername} has already liked this post.`);
            return post.likes; // Return original likes if user already liked
        }
        
    } catch (error) {

        console.log('Error liking a post:', error);
        throw error; 
    }
};

const unlikePost  = async (unlikerUsername, postId) => {
    try {

         // Fetch the user by username to get their ID
         const unlikerUser  = await UserService.getUserByUsername(unlikerUsername);
         if (!unlikerUser ) {
             throw new Error(`User with username ${unlikerUsername} not found`);
         }

         const updatedPost = await PostModel.findById(postId);
         if (!updatedPost) {
             throw new Error(`Post with ID ${postId} not found`);
         }

          // Check if the user is already in the likes array
         if (updatedPost.likes.includes(unlikerUsername)) {
             // Update the post's like list by removing the unliker's username
             postWithUpdatedLikes = await PostModel.findByIdAndUpdate(
                postId,
                { $pull: { likes: unlikerUsername } },
                { new: true } 
            );

            return postWithUpdatedLikes.likes; 

        } else {
            console.log(`User ${unlikerUsername} was not found in likes.`);
            return updatedPost.likes;
        }

    } catch (error) {

        console.log('Error liking a post:', error);
        throw error; 
    }
};

module.exports = {getLikes, likePost, unlikePost }