import { useEffect, useState } from "react";
import Post from "./CardPost";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const userId = user ? user.id : null; // Get the logged-in user's ID

  const fetchPosts = () => {
    setLoading(true);

    api
      .get(`/posts/user/${userId}`) // Fetch posts for the logged-in user
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
      <h1 className="text-2xl font-semibold mb-10">My Posts</h1>
      <ul className="flex flex-col gap-4">
        {error && <p className="italic">{error}</p>}
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

export default MyPosts;
