const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post = new Schema({
    text: {
        type: String,
        required: function() {
            return !this.picture; // Text is required if picture is not provided
        }
      
    },
    picture: {
        type: String,
        required: function() {
            return !this.text; // Picture is required if text is not provided
        }
       
    },
    createdBy: {
        type: String,
        ref: 'User', 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Set default value to the current timestamp when a post is created
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],

    likes: [{
        type: String,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Post', Post);
// collection : Post , db: test