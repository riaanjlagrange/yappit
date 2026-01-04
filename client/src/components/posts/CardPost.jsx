import { useState } from 'react';
import api from '../../utils/api';
import useAuth from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Votes from '../votes/Votes';
import { MdDeleteForever } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';
import UserCard from '../users/UserCard';
import CommentAnnotation from '../comments/CommentAnnotation';

function CardPost({ post, onPostDeleted }) {
  const [deleteError, setDeleteError] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const { user, isLoggedIn, isAdmin, isModerator } = useAuth();
  const navigate = useNavigate();

  const isAuthor = user && user.id === post.created_by;

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${post.id}`);
      onPostDeleted();
    } catch (err) {
      setDeleteError('Failed to delete post.');
      setTimeout(() => setDeleteError(null), 3000);
      window.scrollTo(0, 0);
    }
  };

  const handleUpdate = () => {
    if (!isLoggedIn) {
      setUpdateError('You must be logged in to update a post.');
      setTimeout(() => setUpdateError(null), 3000);
      return;
    }
    navigate(`/posts/${post.id}/update`);
  };

  return (
    <div className="bg-white shadow-md rounded p-4 md:p-8 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <UserCard
          userId={post.created_by}
          authorName={post.author.name}
          authorProfilePic={post.author.profilePic}
          createdAt={post.created_at}
        />

        {/* Topic */}
        <span className="self-start md:self-auto text-xs font-semibold bg-indigo-500 text-white px-3 py-1 rounded-sm">
          {post.topic}
        </span>
      </div>

      {/* Title */}
      <Link
        to={`/posts/${post.id}`}
        className="text-lg md:text-xl font-semibold hover:text-red-400 hover:underline"
      >
        {post.title}
      </Link>

      {/* Content Preview */}
      <p className="text-gray-700 text-sm md:text-base break-words line-clamp-2">
        {post.content}
      </p>

      {/* Footer */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-4">
          <Votes
            postId={post.id}
            initialScore={post.score}
            initialVote={post.userVote}
          />
          <CommentAnnotation
            postId={post.id}
            commentCount={post.commentCount}
          />
        </div>

        {(isAuthor || isAdmin || isModerator) && (
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white w-10 h-10 rounded"
              aria-label="Edit post"
            >
              <AiFillEdit />
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center bg-red-400 hover:bg-red-500 text-white w-10 h-10 rounded"
              aria-label="Delete post"
            >
              <MdDeleteForever />
            </button>
          </div>
        )}
      </div>

      {/* Errors */}
      {deleteError && <p className="text-red-500 text-sm">{deleteError}</p>}
      {updateError && <p className="text-red-500 text-sm">{updateError}</p>}
    </div>
  );
}

export default CardPost;

