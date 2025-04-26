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
      className="flex flex-col gap-2 p-4 rounded shadow-sm border-t-2 border-indigo-500"
    >
      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Write a comment..."
        className="p-2 border-b border-gray-300 rounded-md italic min-h-20 max-h-40 resize-none"
        required
      ></textarea>
      <button
        type="submit"
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md cursor-pointer"
      >
        Post Comment
      </button>
      {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
    </form>
  );
}

export default PostComment;
