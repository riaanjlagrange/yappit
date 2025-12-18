import api from '../../utils/api';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { MdDeleteForever } from 'react-icons/md';
import UserCard from '../users/UserCard';

function Comment({ postAuthorId, comment, onCommentDeleted }) {
  const [error, setError] = useState(null);

  const { user, isAdmin, isModerator } = useAuth();
  const isCommentAuthor = user && user.id === comment.user_id;
  const isPostAuthor = user && user.id === postAuthorId;

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

  const commentColor = isCommentAuthor ? 'border-indigo-300' : 'border-red-300';

  return (
    <div className={`flex flex-col gap-2 p-4 rounded shadow-sm border-t-2 ${commentColor}`}>
      <UserCard userId={comment.user_id} createdAt={comment.created_at} />
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
