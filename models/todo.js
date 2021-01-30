const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    userId: String,
    title: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 20
    },
    body: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500
    },
    tags: { type: [{ type: String, maxlength: 10 }], required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }


});
const Todo = mongoose.model('Todo', schema);

module.exports = Todo