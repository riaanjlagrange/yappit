import { FaComment } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import ContentLoadingSpinner from '../layout/ContentLoadingSpinner';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

function CommentAnnotation({ postId }) {
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommentCount = async (postId) => {
    try {
      const comments = await api.get(`/comments/${postId}`);
      if (comments.data.length === 0) {
        setCommentCount(0);
        setLoading(false);
        return;
      }
      setCommentCount(comments.data.length);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommentCount(postId);
  }, [postId]);

  if (loading) return <ContentLoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Link to={`/posts/${postId}#comments`} className="flex items-center gap-2">
      <FaComment className="text-gray-500 size-5" />
      <span className="text-gray-500 text-sm">{commentCount}</span>
    </Link>
  );
}

export default CommentAnnotation;
