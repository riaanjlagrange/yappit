import { useState } from "react";
import api from "../../utils/api";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState(0);
  const [topic, setTopic] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // setUserId(1); //TODO: need to set author to the logged in user id
    const tempUserId = 1;
    console.log("User ID:", userId);

    const post = { title, content, topic, created_by: tempUserId }; // need to change the created_by to the logged in user id

    console.log("Post data:", post);

    try {
      await api.post("/posts", post).then((response) => {
        console.log("Post created:", response.data);
        setTitle("");
        setContent("");
        setTopic("");
        setUserId("");
      });
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const handleChange = (e) => {
    setTopic(e.target.value);
  };

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
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
