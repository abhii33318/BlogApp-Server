const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogs",
        required: true
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
        comments: {
        type: String,
        required: true
    }
},{ timestamps: true });

const comment = mongoose.model('comments', CommentSchema);

module.exports=comment