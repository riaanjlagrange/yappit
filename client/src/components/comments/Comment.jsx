import api from "../../utils/api";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import getUserNameById from "../../utils/getUserById";
import getTimeAgo from "../../utils/getTimeAgo";
import { useParams } from "react-router-dom";

function Comment({ postAuthorId, comment, onCommentDeleted }) {
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("Unknown Author");

  const { user } = useAuth();
  const isCommentAuthor = user && user.id === comment.user_id;
  const { postId } = useParams(); // Get the post ID from the URL
  const isPostAuthor = user && user.id === postAuthorId;

  const getUserById = async (userId) => {
    setUserName(await getUserNameById(userId));
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/comments/${comment.id}`);
      onCommentDeleted();
    } catch (err) {
      console.error(err.message);
      setError(err.message);
      setTimeout(() => {
        setError(null);
      }, 3000); // Clear the error after 3 seconds
    }
  };

  const commentColor = isCommentAuthor ? "border-indigo-300" : "border-red-300";

  useEffect(() => {
    getUserById(comment.user_id);
  }, [comment.user_id, postId]);

  return (
    <div
      className={`flex flex-col gap-2 p-4 rounded shadow-sm border-t-2 ${commentColor}`}
    >
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{userName}</h2>
        <span className="text-sm text-gray-500 italic">
          ({getTimeAgo(comment.created_at)})
        </span>
      </div>
      <p className="break-words">{comment.content}</p>
      <div className="flex gap-2 justify-end w-full">
        {(isCommentAuthor || isPostAuthor) && (
          <button
            onClick={handleDelete}
            className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded w-60 cursor-pointer"
          >
            Delete
          </button>
        )}
      </div>
      {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
    </div>
  );
}

export default Comment;
