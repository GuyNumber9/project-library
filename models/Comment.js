const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    comment: String
});

module.exports = {
    model: mongoose.model('Comment', CommentSchema),
    schema: CommentSchema
};