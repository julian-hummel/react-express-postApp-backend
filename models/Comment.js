var mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = Comment = mongoose.model('comments', CommentSchema);