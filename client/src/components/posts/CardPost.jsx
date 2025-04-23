import { useState, useEffect } from "react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

function Post({ post, onPostDeleted }) {
  // to fetch the author name from the API
  const [author, setAuthor] = useState("Unknown Author");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const [updateError, setUpdateError] = useState(null);

  const { user, isLoggedIn } = useAuth();

  const navigate = useNavigate();

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
    }
  };
  const handleUpdate = async () => {
    if (!isLoggedIn) {
      setUpdateError("You must be logged in to update a post.");
      return;
    }
    if (user.id !== post.created_by) {
      setUpdateError("You are not authorized to update this post.");
      return;
    }
    navigate(`/posts/${post.id}/update`);
  };

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
      <Link
        to={`/posts/${post.id}`}
        className="text-xl font-semibold mb-2 hover:underline"
      >
        {post.title}
      </Link>
      <p className="text-gray-700 mb-4">{post.topic}</p>
      <p className="text-gray-700 mb-4">{post.content}</p>
      {loading ? (
        <span>Loading...</span>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-gray-700 mb-4">{author}</p>
      )}
      <p className="text-gray-700 mb-4">{post.created_at}</p>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Delete Post
      </button>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Update Post
      </button>
      {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
      {updateError && <p className="text-red-500 mt-2">{updateError}</p>}
    </div>
  );
}

export default Post;
