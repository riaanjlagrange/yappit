import { useEffect, useState } from "react";
import CardPost from "./CardPost";
import api from "../../utils/api";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchPosts = async () => {
    try {
      const posts = await api.get("/posts");
      if (posts.data.length === 0) {
        setErrorMessage("No posts available.");
        return;
      }
      setPosts(posts.data);
    } catch (err) {
      console.error(err.response.status);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (errorMessage) return <div>{errorMessage}</div>;

  return (
    <div className="pb-60">
      <h1 className="text-2xl font-semibold mb-10 pageTitle">All Posts</h1>
      <ul className="flex flex-col gap-10">
        {posts.map((post, index) => (
          <li key={post.id || index}>
            <CardPost post={post} onPostDeleted={fetchPosts} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllPosts;
