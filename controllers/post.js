const PostService = require('../services/post');

const getPosts = async (req, res) => {
   res.json(await PostService.getPosts());
};

const createPost = async (req, res) => {
    try {
        const { text, picture } = req.body;
        const newPost = await PostService.createPost(text, picture);
        res.status(201).json(newPost); // Respond with the created post
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = { getPosts , createPost }