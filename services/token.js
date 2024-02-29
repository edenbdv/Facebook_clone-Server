const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const TokenModel = require('../models/token');

const secretKey = 'your_secret_key'; // Change this to your secret key

const createToken = async (username, password) => {
    try {
        // Find user in the database
        const user = await UserModel.findOne({ username: username });

        // If user is not found or password does not match, throw error
        if (!user || user.password !== password) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '24h' }); // Token expires in 24 hour
        
         // Save the token to the Token collection
         await TokenModel.create({ userId: user._id, token: token, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });
        
         return { token: token };
    } catch (error) {
        console.error(error);
        throw new Error('Token creation failed');
    }
};

module.exports = { createToken };
