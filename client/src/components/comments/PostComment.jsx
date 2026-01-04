import { useState, useEffect } from 'react';
import api from '../../utils/api.js';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import UserCard from '../users/UserCard.jsx';

function PostComment({ onCommentPosted }) {
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(true);

  const { user } = useAuth(); // 'user' here is from JWT, only has id, email, roles

  const { postId } = useParams();
  const commentData = { userId: user.id, content: commentContent };

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      if (user && user.id) {
        try {
          const response = await api.get(`/users/${user.id}`);
          setCurrentUser(response.data);
        } catch (err) {
          console.error('Error fetching current user data:', err);
        } finally {
          setLoadingCurrentUser(false);
        }
      } else {
        setLoadingCurrentUser(false);
      }
    };
    fetchCurrentUserData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/comments/${postId}`, commentData);
      setCommentContent(''); // Clear the input field after submission
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

  // Only render UserCard if current user data is loaded
  if (loadingCurrentUser) return null; // Or a loading spinner

  return (
      <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 px-3 sm:px-4 py-3 rounded shadow-sm border-t-2 border-indigo-500"
    >
      <textarea
	value={commentContent}
	onChange={(e) => setCommentContent(e.target.value)}
	placeholder="Write a comment..."
	className="
	  p-3
	  border border-gray-300
	  rounded-md
	  italic
	  min-h-[80px]
	  max-h-[200px]
	  resize-none
	  focus:outline-none
	  focus:ring-2
	  focus:ring-indigo-400
	  break-words
	"
	required
      />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
	{currentUser && (
	  <div className="w-full sm:w-auto">
	    <UserCard
	      userId={currentUser.id}
	      authorName={currentUser.name}
	      authorProfilePic={currentUser.profilePic}
	    />
	  </div>
	)}

	<button
	  type="submit"
	  className="
	    w-full
	    sm:w-auto
	    bg-indigo-500
	    hover:bg-indigo-600
	    text-white
	    px-5
	    py-2.5
	    rounded-md
	    font-semibold
	    cursor-pointer
	    transition-colors
	  "
	>
	  Post Comment
	</button>
      </div>

      {error && <div className="text-red-400 text-sm mt-1">{error}</div>}
    </form>

  );
}

export default PostComment;
