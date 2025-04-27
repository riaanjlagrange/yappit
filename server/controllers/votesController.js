const pool = require("../db");

// GET VOTE
const getVote = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  console.log("User ID:", userId);
  console.log("Post ID:", postId);

  try {
    const existingVote = await pool.query(
      "SELECT vote FROM post_votes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );

    if (existingVote.rows.length === 0) {
      return res.status(404).json({ error: "No vote found." });
    }

    res.status(200).json(existingVote.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching your vote." });
  }
};

// CAST A VOTE
const vote = async (req, res) => {
  const { userId, postId, vote } = req.body; // vote = 1 or -1

  // check if vote is either 1 or -1
  if (![1, -1].includes(vote))
    return res.status(400).json({ error: "Vote must be 1 or -1" });

  try {
    await pool.query("BEGIN");

    const existingVote = await pool.query(
      "SELECT vote FROM post_votes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );

    // if no existing vote, insert new vote
    if (existingVote.rows.length === 0) {
      await pool.query(
        "INSERT INTO post_votes (user_id, post_id, vote) VALUES ($1, $2, $3)",
        [userId, postId, vote]
      );
      await pool.query("UPDATE posts SET score = score + $1 WHERE id = $2", [
        vote,
        postId,
      ]);
    } else {
      // user already voted
      return res.status(400).json({
        error: "You have already voted. Use PATCH to change your vote.",
      });
    }

    await pool.query("COMMIT");
    res.status(201).json({ message: "Vote registered successfully!" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Something went wrong voting." });
  }
};

// CHANGE VOTE TO TO THE OPPOSITE IF YOU ALREADY VOTED (CHANGED FROM UPVOTE TO DOWNVOTE AND VICE VERSA)
const changeVote = async (req, res) => {
  const { userId, postId, vote } = req.body; // vote = 1 or -1

  // check if vote is either 1 or -1
  if (![1, -1].includes(vote))
    return res.status(400).json({ error: "Vote must be 1 or -1" });

  try {
    await pool.query("BEGIN");

    const existingVote = await pool.query(
      "SELECT vote FROM post_votes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );

    // if no existing vote, insert new vote
    if (existingVote.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "No existing vote to change. Use POST to vote first." });
    }

    const oldVote = existingVote.rows[0].vote;

    if (oldVote === vote) {
      return res.status(400).json({ error: "You already voted this way." });
    }

    await pool.query(
      "UPDATE post_votes SET vote = $1, updated_at = NOW() WHERE user_id = $2 AND post_id = $3",
      [vote, userId, postId]
    );

    // change score on posts table and adjust for change
    const scoreChange = 2 * vote;
    await pool.query("UPDATE posts SET score = score + $1 WHERE id = $2", [
      scoreChange,
      postId,
    ]);

    await pool.query("COMMIT");
    res.status(201).json({ message: "Vote changed successfully!" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Something went wrong changing your vote." });
  }
};

// DELETE VOTE
const deleteVote = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  console.log("User ID:", userId);
  console.log("Post ID:", parseInt(postId));

  try {
    const existingVote = await pool.query(
      "SELECT vote FROM post_votes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );

    if (!existingVote && existingVote.rows.length === 0) {
      res.status(400).json({ error: "No vote to delete." });
    }

    const oldVote = existingVote.rows[0].vote;
    console.log("Old Vote:", oldVote);

    await pool.query(
      "DELETE FROM post_votes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );

    await pool.query("UPDATE posts SET score = score - $1 WHERE id = $2", [
      oldVote,
      postId,
    ]);

    await pool.query("COMMIT;");
    res.json({ message: "Vote deleted successfully." });
  } catch (err) {
    pool.query("ROLLBACK");
    console.log(err);
    res.status(500).json({ error: "Something went wrong deleting your vote." });
  }
};

module.exports = { vote, changeVote, deleteVote, getVote };
