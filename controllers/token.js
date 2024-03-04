
const tokenService = require('../services/token');


const createToken = async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await tokenService.createToken(username, password);

         // Send the token back to the client
        res.json(token);
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: error.message });
    }
};



module.exports = { createToken  };
