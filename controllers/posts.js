const postsService = require('../services/posts');



const getPosts = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }
        res.json(await postsService.getPosts(username));
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = { getPosts }
