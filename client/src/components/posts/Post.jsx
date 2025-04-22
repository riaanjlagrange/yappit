import { useState, useEffect } from "react";
import api from "../../utils/api";
function Post({ post, onPostDeleted }) {
  // to fetch the author name from the API
  const [author, setAuthor] = useState("Unknown Author");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the author name when the component mounts or when post.created_by changes
  // TODO: could use helper function "getUserNameById" to fetch the author name in future

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${post.id}`);
      onPostDeleted();
      console.log("Post deleted successfully");
    } catch (err) {
      console.error(err);
    }
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
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
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
    </div>
  );
}

export default Post;
