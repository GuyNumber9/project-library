const mongoose = require('mongoose');
const Comment = require('./Comment');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    comments: [Comment.schema]
});

module.exports = mongoose.model('Book', BookSchema);