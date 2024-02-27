const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    profilePic: {
        type: String, // Storing the image as a string
        required: true

    },

    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    friendRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
    
});

module.exports = mongoose.model('User', User);
// collection : User , db: test