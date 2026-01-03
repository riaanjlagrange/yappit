import { useEffect, useState } from 'react';
import Post from './CardPost';
import api from '../../utils/api';
import useAuth from '../../hooks/useAuth';
import PageLoadingSpinner from '../layout/PageLoadingSpinner';
import useDebounce from '../../hooks/useDebounce';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedPage = useDebounce(currentPage, 500);

  const { user } = useAuth();

  const fetchPosts = async (userId, page) => {
    try {
      setLoading(true);
      const res = await api.get(`/posts/users/${userId}?page=${page}&limit=10`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        setErrorMessage('No posts found for this user.');
        setPosts([]); // Ensure posts are cleared if a 404 is received
        setTotalPages(0); // Set total pages to 0 if no posts
      } else {
        setErrorMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchPosts(user.id, debouncedPage);
    }
  }, [user, debouncedPage]);

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

  return (
    <div className="pb-60">
      <h1 className="text-2xl font-semibold mb-10 pageTitle">My Posts</h1>
      {errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : posts.length > 0 ? (
        <>
          <ul className="flex flex-col gap-10">
            {posts.map((post, index) => (
              <li key={post.id || index}>
                <Post post={post} onPostDeleted={() => fetchPosts(user.id, currentPage)} />
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
        <p>You have not created any posts yet.</p>
      )}
    </div>
  );
}

export default MyPosts;
