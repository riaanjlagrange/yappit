import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";

function Votes({ postId }) {
  const [vote, setVote] = useState(0);

  const [score, setScore] = useState(0);
  const [scoreLoading, setScoreLoading] = useState(true);
  const [scoreError, setScoreError] = useState(null);

  const { user, isLoggedIn } = useAuth();

  const castVote = async (voteValue) => {
    if (!isLoggedIn || !user) {
      console.log("You must be logged in to vote.");
      return;
    }

    const data = {
      postId: parseInt(postId) || postId,
      userId: user.id,
      vote: voteValue,
    };
    console.log("Vote data:", data);

    if (vote === voteValue) {
      try {
        await api.delete(`/votes/${data.postId}`);
        console.log("Vote deleted successfully.");

        //TODO: setVote should not set itself == to voteValue, retriggers this if you press it again because it is equal again. setVote should only be set by api call
        setVote(0);
        setScore((prevScore) => prevScore - voteValue);
      } catch (err) {
        console.log(err.message);
      }
    } else if (vote === 0) {
      try {
        await api.post("/votes/", data);
        console.log("Vote added successfully!");

        setVote(voteValue);
        setScore((prevScore) => prevScore + voteValue);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      try {
        await api.patch("/votes/", data);
        console.log("Vote changed successfully!");

        setVote(voteValue);
        setScore((prevScore) => prevScore - vote + voteValue);
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  useEffect(() => {
    const fetchVote = async () => {
      if (!isLoggedIn) return;
      try {
        const response = await api.get(`/votes/${postId}`);
        setVote(response.data.vote);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setVote(0); // No vote found, set to 0
          console.log("No vote found for this post.");
          return;
        }
        console.log(err.message);
      }
    };

    const getPostScore = async () => {
      try {
        const response = await api.get(`/posts/score/${postId}`);
        setScore(response.data.score);
      } catch (err) {
        setScoreError(err.message);
        setTimeout(() => {
          setScoreError(null);
        }, 3000); // Clear the error after 3 seconds
      } finally {
        setScoreLoading(false);
      }
    };

    fetchVote();
    getPostScore();
  }, [postId, isLoggedIn]);
  return (
    <div className="flex gap-5 justify-evenly items-center">
      <span
        className={`font-bold ${
          score >= 0 ? "text-indigo-500" : "text-red-500"
        }`}
      >
        {score}
      </span>
      <button
        onClick={() => castVote(1)}
        className={`border p-2 ${
          vote === 1 ? "bg-indigo-500 text-white" : "bg-white"
        }`}
      >
        Upvote
      </button>
      <button
        onClick={() => castVote(-1)}
        className={`border p-2 ${
          vote === -1 ? "bg-red-400 text-white" : "bg-white"
        }`}
      >
        Downvote
      </button>
      {scoreLoading && (
        <div className="text-center mt-10 text-gray-500">Score Loading...</div>
      )}
      {scoreError && (
        <div className="text-center mt-10 text-gray-500">{scoreError}</div>
      )}
    </div>
  );
}

export default Votes;
