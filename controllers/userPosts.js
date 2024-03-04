const userPostsService = require('../services/userPosts');

const createPost = async (req, res) => {
    try {
        const { text, picture } = req.body;
        const userId = req.params.id
        const newPost = await userPostsService.createPost(userId, text, picture);
        res.status(201).json(newPost); // Respond with the created post
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getPosts = async (req, res) => {
    try {
        const username = req.params.id
        res.json(await userPostsService.getPosts(username));
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updatePost = async (req, res) => {

    const postId = req.params.pid;
    const updatedField = req.body;

    // Check if any fields are provided for update
    if (Object.keys(updatedField).length === 0) {
        return res.status(400).json({ errors: ['No fields provided for update'] });
    }

    try {
        const updatedPost  = await userPostsService.updatePost(postId, updatedField);

        if (!updatedPost) {
            return res.status(404).json({ errors: ['Post not found'] });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ errors: ['Failed to update post'] });
    }

}


const deletePost = async (req, res) => {
    try {
        const username = req.params.id
        const postId = req.params.pid
        res.json(await userPostsService.deletePost(username, postId));

    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = { getPosts, createPost, deletePost, updatePost }