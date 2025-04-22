import { useEffect, useState } from "react";
import Post from "./Post";
import React from "react";
import api from "../../utils/api";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = () => {
    setLoading(true);

    api
      .get("/posts")
      .then((response) => {
        response.data.length === 0
          ? setError("No posts available.")
          : setError(null);
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
        setError("Failed to load posts. Please try again later.");
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl">All Posts</h1>
      <ul className="flex flex-col gap-4">
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <span>Loading...</span>
        ) : (
          posts.map((post, index) => (
            <li key={post.id || index}>
              <Post post={post} onPostDeleted={fetchPosts} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default AllPosts;
