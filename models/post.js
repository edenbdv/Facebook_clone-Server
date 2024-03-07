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
        //type: Schema.Types.ObjectId,
        type: String,
        ref: 'User', // Reference to the User model
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Set default value to the current timestamp when a post is created
    },
    comments: [{
        type: String,
        required: true
    }]
});

module.exports = mongoose.model('Post', Post);
// collection : Post , db: test