const prisma = require("../prisma/client");

// GET all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// GET post by id
const getPostById = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).send("Post not found.");
    }

    console.log("Fetched post:", post);
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// GET posts by user id
const getPostsByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const posts = await prisma.post.findMany({
      where: { created_by: userId },
    });

    if (!posts || posts.length === 0) {
      return res.status(404).send("No posts found for this user.");
    }

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// GET posts score
const getPostScore = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        score: true,
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json({ score: post.score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching votes." });
  }
};

// POST create a new post
const createPost = async (req, res) => {
  const { title, content, topic } = req.body;
  const created_by = req.user.id;
  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        topic,
        created_by,
        score: 0,
      },
    });
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// PUT update a post by id
const updatePostById = async (req, res) => {
  const postId = req.params.id;

  try {
    // check if post exists and user is owner
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).send("Post not found.");
    }

    // check if user is authorized to update the post
    if (post.created_by !== req.user.id) {
      return res
        .status(403)
        .send("You are not authorized to update this post.");
    }

    const { title, content, topic } = req.body;

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        topic,
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// DELETE a post by id
const deletePostById = async (req, res) => {
  const postId = req.params.id;

  try {
    // check post ownership and exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).send("Post not found.");
    }

    // check if user is authorized to delete the post
    if (post.created_by !== req.user.id) {
      return res
        .status(403)
        .send("You are not authorized to delete this post.");
    }

    // use a prisma transaction to delete posts and comments
    await prisma.$transaction([
      // delete the comments
      prisma.comment.deleteMany({
        where: { post_id: postId },
      }),
      //delete the votes
      prisma.postVote.deleteMany({
        where: { post_id: postId },
      }),
      // delete the post
      prisma.post.deleteMany({
        where: { id: postId },
      }),
    ]);

    res.status(204).send("Post deleted successfully.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
  getPostsByUserId,
  getPostScore,
};
