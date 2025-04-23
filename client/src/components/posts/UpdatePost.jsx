import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

function UpdatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");

  const { postId } = useParams(); // Get the post ID from the URL

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      });
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const handleChange = (e) => {
    setTopic(e.target.value);
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

  return (
    <div>
      <h1 className="text-2xl">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded"
          required
        ></textarea>
        <select
          id="topic"
          value={topic}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select a topic</option>
          <option value="Discussion">Discussion</option>
          <option value="Theory">Theory</option>
          <option value="Informational">Informational</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Update Post
        </button>
        {loading && <span>Loading...</span>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}

export default UpdatePost;
