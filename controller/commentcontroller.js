const Comment = require('../model/comment');

const newComment = async (req, res) => {
  try {
    const comment = new Comment({
      name: req.body.name, // Modify this to match your comment data structure
      postId: req.params.id,
      comments: req.body.text, 
      UserId: req.body.UserId// Modify this to match your comment data structure
    });
    console.log(comment)
    const savedComment = await comment.save();
    res.json(savedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Could not create comment' });
  }
};

const getComments = async (request, response) => {
  try {
    console.log(request.params.id);
    const comments = await Comment.find({ postId: request.params.id });
    response.status(200).json(comments);
  } catch (error) {
    response.status(500).json(error);
  }
};

const deleteComment = async (request, response) => {
  try {
    const comment = await Comment.deleteOne({ _id: request.params.id });
    response.status(200).json('comment deleted successfully');
  } catch (error) {
    response.status(500).json(error);
  }
};

module.exports.newComment = newComment;
module.exports.getComments = getComments;
module.exports.deleteComment = deleteComment;
