import { useEffect, useState } from "react";
import CardPost from "./CardPost";
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
    <div className="pb-60">
      <h1 className="text-2xl font-semibold mb-10 pageTitle">All Posts</h1>
      <ul className="flex flex-col gap-10">
        {error && <p className="italic">{error}</p>}
        {loading ? (
          <span>Loading...</span>
        ) : (
          posts.map((post, index) => (
            <li key={post.id || index}>
              <CardPost post={post} onPostDeleted={fetchPosts} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default AllPosts;
