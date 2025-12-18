import { useState, useEffect } from 'react';
import CardPost from './CardPost';
import api from '../../utils/api';
import PageLoadingSpinner from '../layout/PageLoadingSpinner';

function UserPosts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchPosts = async (userId) => {
    try {
      const posts = await api.get(`/posts/users/${userId}`);
      setPosts(posts.data);
    } catch (err) {
      console.error(err);
      if (err.status === 404) {
        setMessage('No posts available.');
        return;
      }
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(userId);
  }, [userId]);

  if (loading) return <PageLoadingSpinner />;
  if (message) return <div>{message}</div>;

  return (
    <ul className="flex flex-col gap-10 w-full">
      {posts.map((post, index) => (
        <li key={post.id || index}>
          <CardPost post={post} onPostDeleted={fetchPosts} />
        </li>
      ))}
    </ul>
  );
}

export default UserPosts;
