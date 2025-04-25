import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api.js";
import Comment from "./Comment.jsx";
import { useParams } from "react-router-dom";
import PostComment from "./PostComment.jsx";
import useAuth from "../../hooks/useAuth.js";
// TODO: fix url to give the postId from the url

function AllComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // get postId from url
  const { postId } = useParams();

  const { isLoggedIn } = useAuth();

  const fetchComments = useCallback(async () => {
    try {
      const response = await api.get(`/comments/${postId}`);
      if (response.data.length === 0) {
        setError("No comments yet");
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
    <div className="flex flex-col gap-8">
      <ul className="flex flex-col gap-2">
        {loading && <li>Loading...</li>}
        {error && <li>{error}</li>}
        {!loading && !error && comments.length === 0 && (
          <li>No comments yet</li>
        )}
        {!loading &&
          !error &&
          comments.map((comment) => (
            <li>
              <Comment comment={comment} onCommentDeleted={fetchComments} />
            </li>
          ))}
      </ul>
      {isLoggedIn && <PostComment onCommentPosted={fetchComments} />}
    </div>
  );
}

export default AllComments;
