import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../utils/api";

function FullPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { postId } = useParams(); // Get the post ID from the URL

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await api.get(`/posts/${postId}`);
        const post = response.data;
        console.log("Fetched post data:", post);

        setPost(post);
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
  }, [postId]);

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Posted by{" "}
          <span className="font-medium">{post.author || "Unknown"}</span> •{" "}
          {new Date(post.created_at).toLocaleString()}
        </p>
        <div className="prose dark:prose-invert max-w-none">
          <p>{post.content}</p>
        </div>
      </div>
    </div>
  );
}

export default FullPost;
