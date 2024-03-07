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
        type: String, // Storing the image as a String
        required: true

    },

    friends: [{
        type: String, // Storing usernames as Strings
        //type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    friendRequests: [{
        type: String, // Storing usernames as Strings
        //type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
    
});

module.exports = mongoose.model('User', User);
// collection : User , db: test