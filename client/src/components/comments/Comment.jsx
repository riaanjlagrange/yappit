import api from "../../utils/api";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import getUserById from "../../utils/getUserById";
import getTimeAgo from "../../utils/getTimeAgo";
import { useParams, Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import tempProfilePic from "../../assets/temp-profile.svg";

function Comment({ postAuthorId, comment, onCommentDeleted }) {
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("Unknown Author");
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  const { user, isAdmin, isModerator } = useAuth();
  const isCommentAuthor = user && user.id === comment.user_id;
  const { postId } = useParams(); // Get the post ID from the URL
  const isPostAuthor = user && user.id === postAuthorId;

  const getUser = async (userId) => {
    const user = await getUserById(userId);
    setUserName(user.name);
    setProfilePicUrl(user.profilePicUrl);
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
    getUser(comment.user_id);
  }, [comment.user_id, postId]);

  return (
    <div
      className={`flex flex-col gap-2 p-4 rounded shadow-sm border-t-2 ${commentColor}`}
    >
      <div className="flex items-center gap-2">
        <img
          src={profilePicUrl || tempProfilePic}
          alt="Profile"
          className="size-10 rounded-full"
        />
        <Link
          to={`/users/${comment.user_id}`}
          className="text-lg font-semibold hover:underline hover:text-red-400"
        >
          {userName}
        </Link>
        <span className="text-sm text-gray-500 italic">
          ({getTimeAgo(comment.created_at)})
        </span>
      </div>
      <p className="break-words mt-2 ml-2">{comment.content}</p>
      <div className="flex gap-2 justify-end w-full">
        {(isCommentAuthor || isPostAuthor || isAdmin || isModerator) && (
          <button
            onClick={handleDelete}
            className="bg-red-400 hover:bg-red-500 text-white p-2 rounded cursor-pointer"
          >
            <MdDeleteForever />
          </button>
        )}
      </div>
      {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
    </div>
  );
}

export default Comment;
