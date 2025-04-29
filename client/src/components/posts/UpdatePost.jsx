import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

function UpdatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");

  const { postId } = useParams(); // Get the post ID from the URL

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // created_by is set in backend to the logged in user id
    const post = { title, content, topic };

    console.log("Post data:", post);

    // Update the post using the API
    // TODO: maybe more error handling
    try {
      await api.put(`/posts/${postId}`, post).then((response) => {
        console.log("Post updated:", response.data);
        setTitle("");
        setContent("");
        setTopic("");
        navigate(-1); // Go back to the previous page after updating
      });
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const handleChange = (e) => {
    setTopic(e.target.value);
  };

  const handleDiscard = (e) => {
    e.preventDefault();
    navigate(-1); // Go back to the previous page
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await api.get(`/posts/${postId}`);
        const post = response.data;
        console.log("Fetched post data:", post);

        setTitle(post.title || "");
        setContent(post.content || "");
        setTopic(post.topic || "");
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
  }, [postId]); // Fetch post data when the component mounts or when postId changes

  // UI needs to be updated to be the same as CreatePost.jsx

  return (
    <div className="mx-auto p-8 bg-white shadow-md mt-10 mb-10">
      <h1 className="text-2xl font-semibold mb-10">Update Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full"
            required
          />
          <select
            id="topic"
            value={topic}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          >
            <option value="">Select a topic</option>
            <option value="Discussion">Discussion</option>
            <option value="Theory">Theory</option>
            <option value="Informational">Informational</option>
          </select>
        </div>
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 h-96"
          required
        ></textarea>
        <div className="flex gap-2 justify-end">
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded w-60"
          >
            Post
          </button>
          <button
            onClick={handleDiscard}
            type="button"
            className="bg-red-400 hover:bg-red-500 text-white p-2 rounded w-60"
          >
            Discard
          </button>
        </div>
        {loading && <span>Loading...</span>}
        {error && <p className="text-red-400">{error}</p>}
      </form>
    </div>
  );
}

export default UpdatePost;
