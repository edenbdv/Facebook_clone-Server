const postsService = require('../services/posts');
const tokenService = require('../services/token');




const getPosts = async (req, res) => {
    try {

        const token = req.headers.authorization.split(' ')[1];
        // Verify the token using the token service
        const loggedUsername = await tokenService.verifyToken(token);

        if (!loggedUsername) {
            return res.status(400).json({ error: 'Username is required' });
        }
        
        const posts = await postsService.getPosts(loggedUsername);
        //console.log('response data',posts);
        res.json(posts);
        
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = { getPosts }
