import { useState, useEffect } from 'react';
import CardPost from './CardPost';
import api from '../../utils/api';
import PageLoadingSpinner from '../layout/PageLoadingSpinner';
import useDebounce from '../../hooks/useDebounce';

function UserPosts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedPage = useDebounce(currentPage, 500);

  const fetchPosts = async (userId, page) => {
    try {
      setLoading(true);
      const res = await api.get(`/posts/users/${userId}?page=${page}&limit=10`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        setMessage('No posts available.');
      } else {
        setMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(userId, debouncedPage);
  }, [userId, debouncedPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <PageLoadingSpinner />;
  if (message) return <div>{message}</div>;

  return (
    <div className="pb-60 w-full">
      {posts.length > 0 ? (
        <>
          <ul className="flex flex-col gap-10">
            {posts.map((post, index) => (
              <li key={post.id || index}>
                <CardPost post={post} onPostDeleted={() => fetchPosts(userId, currentPage)} />
              </li>
            ))}
          </ul>
          <div className="flex justify-center items-center mt-10">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
            >
              Previous
            </button>
            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>This user has not created any posts yet.</p>
      )}
    </div>
  );
}

export default UserPosts;
