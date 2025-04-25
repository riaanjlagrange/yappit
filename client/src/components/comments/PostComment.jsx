import { useState } from "react";
import api from "../../utils/api.js";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

function PostComment({ onCommentPosted }) {
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState(null);

  const { user } = useAuth();

  const { postId } = useParams();
  const commentData = { userId: user.id, content: commentContent };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/comments/${postId}`, commentData);
      setCommentContent(""); // Clear the input field after submission
    } catch (err) {
      console.error(err.message);
      setError(err.message);
      setTimeout(() => {
        setError(null);
      }, 3000); // Clear the error after 3 seconds
    } finally {
      onCommentPosted(); // Fetch comments again after posting a new comment
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 p-4 bg-gray-100 rounded-md shadow-md"
    >
      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Write a comment..."
        className="p-2 border border-gray-300 rounded-md"
        required
      ></textarea>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Post Comment
      </button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </form>
  );
}

export default PostComment;
