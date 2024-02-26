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
    comments: [{
        type: String,
        required: true
    }]
});

module.exports = mongoose.model('Post', Post);
