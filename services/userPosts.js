const PostModel = require('../models/post');
const UserModel = require('../models/user');
const UserService = require('../services/user');


const createPost = async (creatorUsername, text, picture) => {
    try {

        const creatorUser = await UserService.getUserByUsername(creatorUsername);
        const creatorId = creatorUser._id;


        const post = new PostModel({ text: text, picture: picture, createdBy: creatorId, comments: [] });
        const savedPost = await post.save();

        // Update the user's posts list with the newly created post ID
        await UserModel.findByIdAndUpdate(creatorId, { $push: { posts: savedPost._id } });


        console.log('Post created:', savedPost);
        return savedPost;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error; // Rethrow the error to be handled by the controller
    }
};


const getPosts = async (username) => {

    const user = await UserService.getUserByUsername(username);
    console.log(user)

    if (!user) {
        return null; // Return null if user is not found
    }

    const postsUserId = user.posts;

    //sort posts by creation date (new to old)
    const postsUser = await PostModel.find({ _id: { $in: postsUserId } }).sort({ createdAt: -1 });


    return postsUser; // Retrieve all user's posts from the database
};


const updatePost = async (postId, updatedField) => {

    try {
        const updatedPost = await PostModel.findByIdAndUpdate(postId, updatedField, { new: true });

        return updatedPost; // Return the updated post
    } catch (error) {
        console.error("Error updating post:", error);
        throw new Error('Failed to update post');
    }
};


const deletePost = async (username, postId) => {
    try {
    
        if (!username || !postId) {
            throw new Error(`Username or post ID not provided`);
        }

        // Remove post from Post collection
        await PostModel.findByIdAndDelete(postId);

        // Remove post ID from the list of posts of the user who created it
        await UserModel.updateOne({ username: username }, { $pull: { posts: postId } });

        return { message: 'Post deleted successfully' };


    } catch (error) {
        console.error('Error deleting post:', error);
        throw new Error('Internal Server Error');
    }
};

module.exports = { createPost, getPosts, updatePost ,deletePost };