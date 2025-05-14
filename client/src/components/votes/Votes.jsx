import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import ContentLoadingSpinner from "../layout/ContentLoadingSpinner";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

function Votes({ postId }) {
  const [vote, setVote] = useState(0);
  const [voteError, setVoteError] = useState(null);

  const [score, setScore] = useState(0);
  const [scoreError, setScoreError] = useState(null);
  const [scoreLoading, setScoreLoading] = useState(true);

  const { user, isLoggedIn } = useAuth();

  const castVote = async (voteValue) => {
    if (!isLoggedIn || !user) {
      setVoteError("You must be logged in to vote.");
      setTimeout(() => {
        setVoteError(null);
      }, 3000);
      return;
    }

    const data = {
      postId: postId,
      userId: user.id,
      vote: voteValue,
    };
    console.log("Vote data:", data);

    if (vote === voteValue) {
      try {
        setVote(0);
        await api.delete(`/votes/${data.postId}`);
        console.log("Vote deleted successfully.");

        setScore((prevScore) => prevScore - voteValue);
      } catch (err) {
        console.log(err.message);
        setVoteError(err.message);
        setTimeout(() => {
          setVoteError(null);
        }, 3000);
      }
    } else if (vote === 0) {
      try {
        setVote(voteValue);
        await api.post("/votes/", data);
        console.log("Vote added successfully!");

        setScore((prevScore) => prevScore + voteValue);
      } catch (err) {
        console.log(err.message);
        setVoteError(err.message);
        setTimeout(() => {
          setVoteError(null);
        }, 3000);
      }
    } else {
      try {
        setVote(voteValue);
        await api.patch("/votes/", data);
        console.log("Vote changed successfully!");

        setScore((prevScore) => prevScore - vote + voteValue);
      } catch (err) {
        console.log(err.message);
        setVoteError(err.message);
        setTimeout(() => {
          setVoteError(null);
        }, 3000);
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
        setVoteError(err.message);
        setTimeout(() => {
          setVoteError(null);
        }, 3000); // clear vote error
      }
    };

    const getPostScore = async () => {
      try {
        const response = await api.get(`/posts/score/${postId}`);
        setScore(response.data.score);
      } catch (err) {
        setScoreError(err.message);
      } finally {
        setScoreLoading(false);
      }
    };

    fetchVote();
    getPostScore();
  }, [postId, isLoggedIn]);

  if (scoreLoading) return <ContentLoadingSpinner />;
  if (scoreError) return <span>{scoreError}</span>;

  return (
    <div className="flex gap-2 justify-evenly items-center text-gray-700">
      <button
        onClick={() => castVote(1)}
        className={`border p-1 rounded-full cursor-pointer ${
          vote === 1 ? "bg-indigo-500 text-white" : "bg-white"
        }`}
      >
        <MdArrowDropUp className="size-5" />
      </button>
      <span
        className={`text-sm font-bold ${
          score >= 0 ? "text-indigo-500" : "text-red-500"
        }`}
      >
        {score}
      </span>
      {scoreError && <div className="text-gray-500">{scoreError}</div>}
      <button
        onClick={() => castVote(-1)}
        className={`border p-1 rounded-full cursor-pointer ${
          vote === -1 ? "bg-red-400 text-white" : "bg-white"
        }`}
      >
        <MdArrowDropDown className="size-5" />
      </button>
      {voteError && <div className="text-red-400 italic">{voteError}</div>}
    </div>
  );
}

export default Votes;
