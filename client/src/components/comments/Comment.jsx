import { useState } from 'react';
import api from '../../utils/api';
import useAuth from '../../hooks/useAuth';
import { MdDeleteForever } from 'react-icons/md';
import UserCard from '../users/UserCard';

function Comment({ postAuthorId, comment, onCommentDeleted }) {
  const [error, setError] = useState(null);

  const { user, isAdmin, isModerator } = useAuth();

  const isCommentAuthor = user && user.id === comment.user_id;
  const isPostAuthor = user && user.id === postAuthorId;

  const canDelete =
    isCommentAuthor || isPostAuthor || isAdmin || isModerator;

  const handleDelete = async () => {
    try {
      await api.delete(`/comments/${comment.id}`);
      onCommentDeleted();
    } catch (err) {
      console.error(err.message);
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const commentBorderColor = isCommentAuthor
    ? 'border-indigo-300'
    : 'border-red-300';

  return (
    <div
      className={`
        flex flex-col gap-3
        p-3 sm:p-4
        rounded-md
        shadow-sm
        border-t-2
        ${commentBorderColor}
      `}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <UserCard
          userId={comment.user_id}
          authorName={comment.user.name}
          authorProfilePic={comment.user.profilePic}
          createdAt={comment.created_at}
        />

        {canDelete && (
          <button
            onClick={handleDelete}
            aria-label="Delete comment"
            className="
              self-end sm:self-auto
              bg-red-400
              hover:bg-red-500
              text-white
              p-2.5
              rounded-md
              cursor-pointer
              transition-colors
            "
          >
            <MdDeleteForever size={18} />
          </button>
        )}
      </div>

      {/* Content */}
      <p
        className="
          break-words
          whitespace-pre-wrap
          text-gray-800
          text-sm sm:text-base
          leading-relaxed
          px-1
        "
      >
        {comment.content}
      </p>

      {/* Error */}
      {error && (
        <div className="text-red-400 text-sm mt-1">
          {error}
        </div>
      )}
    </div>
  );
}

export default Comment;

