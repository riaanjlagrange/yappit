import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import AllComments from '../comments/AllComments';
import Votes from '../votes/Votes';
import PageLoadingSpinner from '../layout/PageLoadingSpinner';
import api from '../../utils/api';
import { MdDeleteForever } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';
import UserCard from '../users/UserCard';

function FullPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const { user, isLoggedIn, isAdmin, isModerator } = useAuth();
  const { postId } = useParams();
  const navigate = useNavigate();
  const { hash } = useLocation();

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${postId}`);
      navigate('/posts');
    } catch (err) {
      setDeleteError('Failed to delete post.');
      setTimeout(() => setDeleteError(null), 3000);
    }
  };

  const handleUpdate = () => {
    if (!isLoggedIn) {
      setUpdateError('You must be logged in to update a post.');
      setTimeout(() => setUpdateError(null), 3000);
      return;
    }
    navigate(`/posts/${postId}/update`);
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await api.get(`/posts/${postId}`);
        setPost(res.data);
        setIsAuthor(user && user.id === res.data.created_by);
      } catch {
        setError('Failed to load post data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();

    if (hash === '#comments') {
      const scroll = () => {
        const el = document.getElementById('comments');
        el ? el.scrollIntoView({ behavior: 'smooth' }) : setTimeout(scroll, 100);
      };
      scroll();
    }
  }, [postId, user, hash]);

  if (loading) return <PageLoadingSpinner />;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <div className="flex flex-col gap-6 px-3 md:px-0 pb-20">
      {/* Post */}
      <div className="bg-white shadow-md rounded p-4 md:p-8 relative">
        {/* Header */}
        <div className="flex flex-col gap-3">
	  <h1 className="text-2xl md:text-3xl font-bold break-words break-all">
	    {post.title}
	  </h1>


          <UserCard
            userId={post.created_by}
            authorName={post.author.name}
            authorProfilePic={post.author.profilePic}
            createdAt={post.created_at}
          />

          {/* Topic */}
          <span className="self-start text-xs font-semibold bg-indigo-500 text-white px-3 py-1 rounded-sm">
            {post.topic}
          </span>
        </div>

        {/* Content */}
        <p className="mt-6 text-sm md:text-base break-words whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Footer */}
        <div className="mt-8 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
          <Votes postId={postId} />

          {(isAuthor || isAdmin || isModerator) && (
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="w-10 h-10 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded"
                aria-label="Edit post"
              >
                <AiFillEdit />
              </button>
              <button
                onClick={handleDelete}
                className="w-10 h-10 flex items-center justify-center bg-red-400 hover:bg-red-500 text-white rounded"
                aria-label="Delete post"
              >
                <MdDeleteForever />
              </button>
            </div>
          )}
        </div>

        {deleteError && <p className="text-red-500 text-sm mt-2">{deleteError}</p>}
        {updateError && <p className="text-red-500 text-sm mt-2">{updateError}</p>}
      </div>

      {/* Comments */}
      <div className="bg-white shadow-md rounded p-4 md:p-8">
        <div id="comments">
          <AllComments postAuthorId={post.created_by} />
        </div>

        {!isLoggedIn && (
          <p className="text-red-400 mt-4 text-sm">
            You must be logged in to post a comment. Click{' '}
            <Link
              to="/login"
              className="font-semibold underline hover:text-indigo-500"
            >
              here
            </Link>{' '}
            to log in.
          </p>
        )}
      </div>
    </div>
  );
}

export default FullPost;

