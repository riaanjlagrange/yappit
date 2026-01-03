import { useEffect, useState } from 'react';
import CardPost from './CardPost';
import api from '../../utils/api';
import PageLoadingSpinner from '../layout/PageLoadingSpinner';
import useDebounce from '../../hooks/useDebounce';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedPage = useDebounce(currentPage, 500);

  const fetchPosts = async (page) => {
    try {
      setLoading(true);
      const res = await api.get(`/posts?page=${page}&limit=10`);
      if (res.data.posts.length === 0) {
        setErrorMessage('No posts available.');
        return;
      }
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        setErrorMessage('No posts available.');
      } else {
        setErrorMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(debouncedPage);
  }, [debouncedPage]);

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
  if (errorMessage) return <div>{errorMessage}</div>;

  return (
    <div className="pb-60">
      <h1 className="text-2xl font-semibold mb-10 pageTitle">All Posts</h1>
      <ul className="flex flex-col gap-10">
        {posts.map((post, index) => (
          <li key={post.id || index}>
            <CardPost post={post} onPostDeleted={() => fetchPosts(currentPage)} />
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
    </div>
  );
}

export default AllPosts;
