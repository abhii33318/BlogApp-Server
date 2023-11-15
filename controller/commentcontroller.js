const comment = require('../model/comment');
const Comment = require('../model/comment');



/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         text:
 *           type: string
 *         UserId:
 *           type: string
 *
 * /comments/{id}:
 *   post:
 *     summary: Create a new comment
 *     description: Use this endpoint to create a new comment.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the associated post
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Comment details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Comment created successfully
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get comments for a post
 *     description: Use this endpoint to retrieve comments for a specific post.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the associated post
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete a comment by ID
 *     description: Use this endpoint to delete a comment by ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the comment to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       500:
 *         description: Server error
 */


const newComment = async (req, res) => {
  try {
    const comment = new Comment({
      name: req.body.name,
      postId: req.params.id,
      comments: req.body.text, 
      UserId: req.body.UserId
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
const updateComment = async (req, res) => {
  console.log(req.user)
  try {
    
    const updatedComment = await Comment.updateOne(
      {
        _id: req.params.id,
        UserId: req.user._id,
        
        createdAt: {
          $gte: new Date(new Date() - 30 * 60 * 1000) // Check if createdAt is within the last 30 minutes
        }
      },
      {
        $set: {
          comments: req.body.text
          
        }
      },
      {
        returnDocument: 'after' // Return the updated document
      }
    )
    console.log("updated comment",updatedComment)

    if (!updatedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Could not update comment' });
  }
};
module.exports.updateComment = updateComment
module.exports.newComment = newComment;
module.exports.getComments = getComments;
module.exports.deleteComment = deleteComment;

