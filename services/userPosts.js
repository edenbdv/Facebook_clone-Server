const PostModel = require('../models/post');
const UserModel = require('../models/user');


const getPosts = async () => {
    return await PostModel.find(); // Retrieve all posts from the database
};

const createPost = async (userId,text, picture) => {
    try {
        const post = new PostModel({ text: text, picture: picture, comments: [] });
        const savedPost = await post.save();

         // Update the user's posts list with the newly created post ID
         await UserModel.findByIdAndUpdate(userId, { $push: { posts: savedPost._id } });


        console.log('Post created:', savedPost);
        return savedPost;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error; // Rethrow the error to be handled by the controller
    }
};

module.exports = { getPosts, createPost };