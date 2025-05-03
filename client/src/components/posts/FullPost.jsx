import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import getTimeAgo from "../../utils/getTimeAgo";
import AllComments from "../comments/AllComments";
import Votes from "../votes/Votes";
import api from "../../utils/api";

function FullPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [author, setAuthor] = useState("Unknown Author");
  const [isAuthor, setIsAuthor] = useState(false);
  const [timeAgo, setTimeAgo] = useState(null);

  const [deleteError, setDeleteError] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const { user, isLoggedIn, isAdmin, isModerator } = useAuth();

  const navigate = useNavigate();

  const { postId } = useParams(); // Get the post ID from the URL

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/posts/${postId}`);
      if (response.status === 204) {
        console.log("Post deleted successfully");
        // go back to top of the page
        window.scrollTo(0, 0);
        navigate("/posts"); // Redirect to the posts page after deletion
      }
    } catch (err) {
      console.error(err);
      setDeleteError("Failed to delete post." + " " + err.message);
      setTimeout(() => {
        setDeleteError(null);
      }, 3000); // Clear the error after 3 seconds
    }
  };

  const handleUpdate = async () => {
    if (!isLoggedIn) {
      setUpdateError("You must be logged in to update a post.");
      setTimeout(() => {
        setUpdateError(null);
      }, 3000);
      return;
    }
    // if (user.id !== post.created_by) {
    //   setUpdateError("You are not authorized to update this post.");
    //   setTimeout(() => {
    //     setUpdateError(null);
    //   }, 3000);
    //   return;
    // }
    window.scrollTo(0, 0);
    navigate(`/posts/${post.id}/update`);
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await api.get(`/posts/${postId}`);
        const post = response.data;
        console.log("Fetched post data:", post);
        setPost(post);
        getUserById(post.created_by); // Fetch the author name using the user ID
        setIsAuthor(user && user.id === post.created_by); // Check if the logged-in user is the author of the post
        setTimeAgo(getTimeAgo(post.created_at)); // Get the time ago string
      } catch (err) {
        console.error("Error fetching post data:", err);
        setError("Failed to load post data.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId, user]); // Fetch post data when the component mounts or when postId changes

  // Fetch the author name from the API using the user ID
  const getUserById = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      if (response.data) {
        setAuthor(response.data.name || "Unknown Author");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      return "Unknown Author";
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <div className="pb-50 flex flex-col gap-5">
      <div className="bg-white min-h-[60vh] shadow-md w-full p-8 rounded relative">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-700">
          Posted by <span className="font-semibold">{author}</span>
        </p>
        <div className="mb-5">
          <span className="text-sm text-gray-500 italic">({timeAgo})</span>
        </div>
        <p className="w-full h-1/2 break-words whitespace-normal mb-10 pt-5 px-3 border-t border-gray-300">
          {post.content}
        </p>

        <p className="font-semibold mb-4 text-sm bg-indigo-500 w-1/8 flex justify-center rounded-full text-white p-1 absolute top-5 right-5">
          {post.topic}
        </p>

        <div className="absolute bottom-5 left-5">
          <Votes postId={postId} />
        </div>

        {/* Show the delete and update buttons only if the user is logged in and is the author of the post */}
        {(isAuthor || isAdmin || isModerator) && (
          <div className="flex justify-between gap-3 absolute bottom-5 right-5 w-1/2">
            <button
              onClick={handleUpdate}
              className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 w-full cursor-pointer"
            >
              Update Post
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-400 text-white p-2 rounded hover:bg-red-500 w-full cursor-pointer"
            >
              Delete Post
            </button>
          </div>
        )}
        {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
        {updateError && <p className="text-red-500 mt-2">{updateError}</p>}
        {/* TODO: implement comments section
      <div className="bg-white p-8 shadow-md w-1/3">
        <h1 className="text-xl font-bold mb-4">Comments</h1>
      </div>
    */}
      </div>
      <div className="bg-white w-full p-8 rounded shadow-md">
        <AllComments postAuthorId={post.created_by} />
        {!isLoggedIn && (
          <p className="text-red-400 mt-2">
            You must be logged in to post a comment. Click{" "}
            <Link
              className="font-semibold hover:text-indigo-500 underline italic"
              to="/login"
            >
              here
            </Link>{" "}
            to log in.
          </p>
        )}
      </div>
    </div>
  );
}

export default FullPost;
