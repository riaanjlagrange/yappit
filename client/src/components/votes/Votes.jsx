import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";

function Votes({ postId }) {
  const [vote, setVote] = useState(0);
  const [voteLoading, setVoteLoading] = useState(true);
  const [voteMessage, setVoteMessage] = useState(null);

  const [score, setScore] = useState(0);
  const [scoreLoading, setLoading] = useState(true);
  const [scoreError, setError] = useState(null);

  const { user, isLoggedIn } = useAuth();

  const castVote = async (voteValue) => {
    if (!isLoggedIn) {
      setVoteMessage("You must be logged in to vote.");
      setTimeout(() => {
        setVoteMessage(null);
      }, 3000);
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
        setVoteMessage("Vote deleted successfully.");

        //TODO: setVote should not set itself == to voteValue, retriggers this if you press it again because it is equal again. setVote should only be set by api call
        setVote(0);
        setScore((prevScore) => prevScore - voteValue);
      } catch (err) {
        setVoteMessage(err.message);
      } finally {
        setVoteLoading(false);
      }
    } else if (vote === 0) {
      try {
        await api.post("/votes/", data);
        setVoteMessage("Vote added successfully!");

        // need to move these functions out of the useeffect
        setVote(voteValue);
        setScore((prevScore) => prevScore + voteValue);
      } catch (err) {
        setVoteMessage(err.message);
      } finally {
        setVoteLoading(false);
      }
    } else {
      try {
        await api.patch("/votes/", data);
        setVoteMessage("Vote changed successfully!");

        // need to move these functions out of the useeffect
        setVote(voteValue);
        setScore((prevScore) => prevScore - vote + voteValue);
      } catch (err) {
        setVoteMessage(err.message);
      } finally {
        setVoteLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchVote = async () => {
      if (!isLoggedIn) return;
      try {
        const response = await api.get(`/votes/${postId}`);
        console.log("Vote response:", response.data);
        setVote(response.data.vote);
        console.log("Vote:", response.data.vote);
      } catch (err) {
        setVoteMessage(err.message);
      } finally {
        setVoteLoading(false);
      }
    };

    const getPostScore = async () => {
      try {
        const response = await api.get(`/posts/score/${postId}`);
        setScore(response.data.score);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVote();
    getPostScore();
  }, [postId, isLoggedIn]);
  return (
    <div className="votes">
      <button
        onClick={() => castVote(1)}
        className={`${vote === 1 ? "bg-green-500" : "bg-white"}`}
      >
        upvote
      </button>
      <button
        onClick={() => castVote(-1)}
        className={`${vote === -1 ? "bg-red-500" : "bg-white"}`}
      >
        downvote
      </button>
      {voteLoading && (
        <div className="text-center mt-10 text-gray-500">Loading...</div>
      )}
      {voteMessage && (
        <div className="text-center mt-10 text-gray-500">{voteMessage}</div>
      )}
      <span>{score}</span>
      {scoreLoading && (
        <div className="text-center mt-10 text-gray-500">Loading...</div>
      )}
      {scoreError && (
        <div className="text-center mt-10 text-gray-500">{scoreError}</div>
      )}
    </div>
  );
}

export default Votes;
