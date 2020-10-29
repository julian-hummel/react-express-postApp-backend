var mongoose = require('mongoose');

/*
 * User Schema with four required informations the request has to contain: firstName, lastName, email and password
 */

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    repeatPassword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: "user"
    }
});

module.exports = User = mongoose.model('users', UserSchema);