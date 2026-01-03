import api from '../../utils/api';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';

function Votes({ postId, initialVote = 0, initialScore = 0 }) {
  const [vote, setVote] = useState(initialVote);
  const [score, setScore] = useState(initialScore);
  const [voteError, setVoteError] = useState(null);

  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    setVote(initialVote);
    setScore(initialScore);
  }, [initialVote, initialScore]);

  const castVote = async (voteValue) => {
    if (!isLoggedIn || !user) {
      setVoteError('You must be logged in to vote.');
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

    const previousVote = vote;
    const previousScore = score;

    // Optimistic update
    let newVote = vote;
    let newScore = score;

    if (vote === voteValue) {
      // User is undoing their vote
      newVote = 0;
      newScore -= voteValue;
    } else if (vote === 0) {
      // User is casting a new vote
      newVote = voteValue;
      newScore += voteValue;
    } else {
      // User is changing their vote
      newVote = voteValue;
      newScore = score - vote + voteValue;
    }

    setVote(newVote);
    setScore(newScore);

    try {
      if (previousVote === voteValue) {
        await api.delete(`/votes/${data.postId}`);
      } else if (previousVote === 0) {
        await api.post('/votes/', data);
      } else {
        await api.patch('/votes/', data);
      }
    } catch (err) {
      // Revert on error
      setVote(previousVote);
      setScore(previousScore);
      setVoteError(err.message);
      setTimeout(() => {
        setVoteError(null);
      }, 3000);
    }
  };

  return (
    <div className="flex gap-2 justify-evenly items-center text-gray-700">
      <button
        onClick={() => castVote(1)}
        className={`border p-1 rounded-full cursor-pointer ${
          vote === 1 ? 'bg-indigo-500 text-white' : 'bg-white'
        }`}
      >
        <MdArrowDropUp className="size-5" />
      </button>
      <span className={`text-sm font-bold ${score >= 0 ? 'text-indigo-500' : 'text-red-500'}`}>
        {score}
      </span>
      <button
        onClick={() => castVote(-1)}
        className={`border p-1 rounded-full cursor-pointer ${
          vote === -1 ? 'bg-red-400 text-white' : 'bg-white'
        }`}
      >
        <MdArrowDropDown className="size-5" />
      </button>
      {voteError && <div className="text-red-400 italic">{voteError}</div>}
    </div>
  );
}

export default Votes;
