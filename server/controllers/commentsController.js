const prisma = require("../prisma/client");

// GET all comments from post
const getAllCommentsFromPost = async (req, res) => {
  const postId = parseInt(req.params.postId);

  try {
    const comments = await prisma.comment.findMany({
      where: {
        post_id: postId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedComments = comments.map((comment) => ({
      ...comment,
      name: comment.user.name,
    }));

    console.log("Fetched comments:", formattedComments);
    res.json(formattedComments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST a comment
const postComment = async (req, res) => {
  const postId = parseInt(req.params.postId);
  const { userId, content } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        post_id: postId,
        user_id: userId,
        content: content,
      },
    });

    res.status(201).json(newComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE a comment
const deleteComment = async (req, res) => {
  const commentId = parseInt(req.params.commentId);

  try {
    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    // Check if comment exists
    if (!comment) {
      return res.status(404).send("Comment not found.");
    }

    // Find the post to check ownership
    const post = await prisma.post.findUnique({
      where: {
        id: comment.post_id,
      },
    });

    // Get post user id to check if the user is the author of the post
    const postUserId = post.created_by;

    // Check if user is authorized to delete the comment
    if (comment.user_id !== req.user.id && req.user.id !== postUserId) {
      return res
        .status(403)
        .send("You are not authorized to delete this comment.");
    }

    // Delete the comment
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    res.json({ message: "Comment deleted successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllCommentsFromPost,
  postComment,
  deleteComment,
};
