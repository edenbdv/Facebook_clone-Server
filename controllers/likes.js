const likesService = require('../services/likes');
const tokenService = require('../services/token');


const getLikes = async (req, res) => {
    try {
        const postId = req.params.pid;
        // Extract the token from the request headers

       const likesLst = await likesService.getLikes(postId);

        res.status(201).json(likesLst); 

    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const likePost = async (req, res) => {
    try {

        const postId = req.params.pid;

        // Extract the token from the request headers
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token using the token service
        const loggedUsername = await tokenService.verifyToken(token);

       const likesLst = await likesService.likePost(loggedUsername, postId);

        res.status(201).json(likesLst); 

    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const unlikePost = async (req, res) => {
    try {

        const postId = req.params.pid;

        // Extract the token from the request headers
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token using the token service
        const loggedUsername = await tokenService.verifyToken(token);
       const likesLst = await likesService.unlikePost(loggedUsername, postId);

        res.status(201).json(likesLst); 

    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {getLikes, likePost, unlikePost }