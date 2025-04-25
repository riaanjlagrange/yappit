import { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // created_by is set in backend to the logged in user id
    const post = { title, content, topic }; // need to change the created_by to the logged in user id

    console.log("Post data:", post);

    try {
      await api.post("/posts", post).then((response) => {
        console.log("Post updated:", response.data);
        setTitle("");
        setContent("");
        setTopic("");
        navigate(`/posts/${response.data.id}`); // Go to the new post page after creating
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
    navigate(-1);
  };

  return (
    <div className="mx-auto p-8 bg-white shadow-md mt-10 mb-10">
      <h1 className="text-2xl font-semibold mb-10">Create a New Post</h1>
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
      </form>
    </div>
  );
}

export default CreatePost;
