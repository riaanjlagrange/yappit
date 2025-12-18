import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api.js';
import Comment from './Comment.jsx';
import { useParams } from 'react-router-dom';
import PostComment from './PostComment.jsx';
import useAuth from '../../hooks/useAuth.js';
import ContentLoadingSpinner from '../layout/ContentLoadingSpinner.jsx';

function AllComments({ postAuthorId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // get postId from url
  const { postId } = useParams();

  const { isLoggedIn } = useAuth();

  const fetchComments = useCallback(async () => {
    try {
      const response = await api.get(`/comments/${postId}`);
      console.log(response.data);
      if (response.data.length === 0) {
        setError('No comments yet');
        setLoading(false);
        return;
      }
      setComments(response.data);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [postId, fetchComments]);

  return (
    <div className="flex flex-col gap-5">
      {isLoggedIn && <PostComment onCommentPosted={fetchComments} />}
      <span className="text-md text-gray-500">
        Comments ({comments.length > 0 ? comments.length : 0})
      </span>
      <ul className="flex flex-col gap-2">
        {loading && <ContentLoadingSpinner />}
        {error && <li>{error}</li>}
        {!loading && !error && comments.length === 0 && <li>No comments yet</li>}
        {!loading &&
          !error &&
          comments.map((comment) => (
            <li key={comment.id}>
              <Comment
                comment={comment}
                postAuthorId={postAuthorId}
                onCommentDeleted={fetchComments}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}

export default AllComments;
