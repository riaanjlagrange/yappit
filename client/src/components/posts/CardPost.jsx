import { useState, useEffect } from "react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

function CardPost({ post, onPostDeleted }) {
  // to fetch the author name from the API
  const [author, setAuthor] = useState("Unknown Author");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const [updateError, setUpdateError] = useState(null);

  const { user, isLoggedIn } = useAuth();

  const navigate = useNavigate();

  // Check if the user is logged in and if they are the author of the post
  const isAuthor = user && user.id === post.created_by;

  // TODO: display how long ago a post was created instead of the date
  const timeCreated = new Date(post.created_at).toLocaleString("en-ZA");

  // Fetch the author name when the component mounts or when post.created_by changes
  // TODO: could use helper function "getUserNameById" to fetch the author name in future

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${post.id}`);
      onPostDeleted();
      console.log("Post deleted successfully");
    } catch (err) {
      console.error(err);
      setDeleteError("Failed to delete post." + " " + err.message);
      setTimeout(() => {
        setDeleteError(null);
      }, 3000); // Clear the error after 3 seconds
      window.scrollTo(0, 0); // Scroll to the top of the page
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
    if (user.id !== post.created_by) {
      setUpdateError("You are not authorized to update this post.");
      setTimeout(() => {
        setUpdateError(null);
      }, 3000);
      return;
    }
    window.scrollTo(0, 0); // Scroll to the top of the page
    navigate(`/posts/${post.id}/update`);
  };

  // Fetch the author name from the API
  useEffect(() => {
    if (post.created_by) {
      api
        .get(`/users/${post.created_by}`)
        .then((response) => response.data)
        .then((data) => {
          setAuthor(data.name || "Unknown Author");
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching author:", error);
          setAuthor("Unknown Author");
          setError("Failed to load author.");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [post.created_by]);

  return (
    <div className="p-4 shadow-md bg-white flex flex-col mb-4">
      <div className="flex justify-between mb-2">
        <Link
          to={`/posts/${post.id}`}
          className="text-xl font-semibold mb-2 hover:underline"
        >
          {post.title}
        </Link>
        <p className="font-semibold mb-4 text-sm bg-indigo-400 w-1/8 flex justify-center rounded-full text-white p-1">
          {post.topic}
        </p>
      </div>
      <p className="text-gray-700 mb-8">{post.content}</p>

      {loading ? (
        <span className="italic">Loading...</span>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-gray-700 mb-4">
          Posted by <span className="font-bold">{author}</span>
        </p>
      )}

      <p className="text-gray-700 mb-4 text-md text-sm">{timeCreated}</p>
      {user && user.id === post.created_by && (
        <p className="text-gray-700 mb-4 italic text-sm">
          You are the author of this post.
        </p>
      )}

      {/* Show the delete and update buttons only if the user is logged in and is the author of the post */}
      {isLoggedIn && isAuthor && (
        <div className="flex justify-between gap-3">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-full cursor-pointer"
          >
            Delete Post
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full cursor-pointer"
          >
            Update Post
          </button>
        </div>
      )}
      {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
      {updateError && <p className="text-red-500 mt-2">{updateError}</p>}
    </div>
  );
}

export default CardPost;
