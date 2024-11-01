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
        ref: 'User'
    }],

    friendRequests: [{
        type: String, // Storing usernames as Strings
        ref: 'User'
    }],

    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
    
});

// Middleware to ensure unique entries in friends and friendRequests
User.pre('save', function (next) {
    this.friends = [...new Set(this.friends)];
    this.friendRequests = [...new Set(this.friendRequests)];
    next();
});

module.exports = mongoose.model('User', User);
// collection : User , db: test