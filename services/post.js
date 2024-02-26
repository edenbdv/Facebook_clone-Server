// services/post.js
const PostModel = require('../models/post');

const getPosts = async () => {
    return await PostModel.find(); // Retrieve all posts from the database
};

const createPost = async (text, picture) => {
    try {
        const post = new PostModel({ text: text, picture: picture, comments: [] });
        const savedPost = await post.save();
        console.log('Post created:', savedPost);
        return savedPost;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error; // Rethrow the error to be handled by the controller
    }
};

module.exports = { getPosts, createPost };
