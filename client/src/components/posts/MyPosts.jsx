import { useEffect, useState } from 'react';
import Post from './CardPost';
import api from '../../utils/api';
import useAuth from '../../hooks/useAuth';
import PageLoadingSpinner from '../layout/PageLoadingSpinner';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const { user } = useAuth();

  const fetchPosts = async (userId) => {
    try {
      const posts = await api.get(`/posts/users/${userId}`);
      setPosts(posts.data);
    } catch (err) {
      console.error(err);
      if (err.status === 404) {
        setErrorMessage('No posts available.');
        return;
      }
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(user.id);
  }, [user.id]);

  if (loading) return <PageLoadingSpinner />;
  if (errorMessage || !user) return <div>{errorMessage}</div>;

  return (
    <div className="pb-60">
      <h1 className="text-2xl font-semibold mb-10 pageTitle">My Posts</h1>
      <ul className="flex flex-col gap-10">
        {posts.map((post, index) => (
          <li key={post.id || index}>
            <Post post={post} onPostDeleted={fetchPosts} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyPosts;
