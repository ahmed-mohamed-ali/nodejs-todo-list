const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15
    },
    age: {
        type: Number,
        required: false,
        min: 13
    }

});
const User = mongoose.model('User', schema);

module.exports = User