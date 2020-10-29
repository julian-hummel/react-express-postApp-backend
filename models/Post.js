var mongoose = require('mongoose');

/*
 * User Schema with four required informations the request has to contain: firstName, lastName, email and password
 */

const PostSchema = mongoose.Schema({
    postHeader: {
        type: String,
        required: true
    },
    postContent: {
        type: String,
        required: true
    },
    creatorName: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    postId: {
        type: String,
        required: true
    }
});

module.exports = Post = mongoose.model('posts', PostSchema);