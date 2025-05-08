const prisma = require("../prisma/client.js");

// GET VOTE
const getVote = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  console.log("User ID:", userId);
  console.log("Post ID:", postId);

  try {
    const existingVote = await prisma.postVote.findUnique({
      where: {
        user_id_post_id: {
          user_id: userId,
          post_id: postId,
        },
      },
      select: {
        vote: true,
      },
    });

    if (!existingVote) {
      return res.status(404).json({ error: "No vote found." });
    }

    res.status(200).json(existingVote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching your vote." });
  }
};

// CAST A VOTE
const vote = async (req, res) => {
  const { userId, postId, vote } = req.body; // vote = 1 or -1

  // check if vote is either 1 or -1
  if (![1, -1].includes(vote)) {
    return res.status(400).json({ error: "Vote must be 1 or -1" });
  }

  try {
    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Check for existing vote
      const existingVote = await prisma.postVote.findFirst({
        where: {
          user_id: userId,
          post_id: postId,
        },
      });

      // If no existing vote, insert new vote
      if (!existingVote) {
        // Create the vote
        await prisma.postVote.create({
          data: {
            user_id: userId,
            post_id: postId,
            vote: vote,
          },
        });

        // Update the post score
        await prisma.post.update({
          where: { id: postId },
          data: {
            score: { increment: vote },
          },
        });

        return { success: true, message: "Vote registered successfully!" };
      } else {
        // User already voted
        return {
          success: false,
          error: "You have already voted. Use PATCH to change your vote.",
        };
      }
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.status(201).json({ message: result.message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong voting." });
  }
};

// CHANGE VOTE TO THE OPPOSITE IF YOU ALREADY VOTED (CHANGED FROM UPVOTE TO DOWNVOTE AND VICE VERSA)
const changeVote = async (req, res) => {
  const { userId, postId, vote } = req.body; // vote = 1 or -1

  // check if vote is either 1 or -1
  if (![1, -1].includes(vote)) {
    return res.status(400).json({ error: "Vote must be 1 or -1" });
  }

  try {
    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Check for existing vote
      const existingVote = await prisma.postVote.findUnique({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
      });

      // If no existing vote, return error
      if (!existingVote) {
        return {
          success: false,
          error: "No existing vote to change. Use POST to vote first.",
        };
      }

      const oldVote = existingVote.vote;

      // If same vote, return error
      if (oldVote === vote) {
        return { success: false, error: "You already voted this way." };
      }

      // Update the vote
      await prisma.postVote.update({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
        data: {
          vote: vote,
          updated_at: new Date(),
        },
      });

      // Update the post score - adjust by 2x vote (to reverse the old vote and add the new one)
      const scoreChange = 2 * vote;
      await prisma.post.update({
        where: { id: postId },
        data: {
          score: { increment: scoreChange },
        },
      });

      return { success: true, message: "Vote changed successfully!" };
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.status(200).json({ message: result.message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong changing your vote." });
  }
};

// DELETE VOTE
const deleteVote = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  console.log("User ID:", userId);
  console.log("Post ID:", postId);

  try {
    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Check for existing vote
      const existingVote = await prisma.postVote.findUnique({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
      });

      if (!existingVote) {
        return { success: false, error: "No vote to delete." };
      }

      const oldVote = existingVote.vote;
      console.log("Old Vote:", oldVote);

      // Delete the vote
      await prisma.postVote.delete({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
      });

      // Update the post score
      await prisma.post.update({
        where: { id: postId },
        data: {
          score: { decrement: oldVote },
        },
      });

      return { success: true, message: "Vote deleted successfully." };
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ message: result.message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong deleting your vote." });
  }
};

module.exports = { vote, changeVote, deleteVote, getVote };
