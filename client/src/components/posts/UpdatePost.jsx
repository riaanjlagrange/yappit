import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

function UpdatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');

  const { postId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const post = { title, content, topic };

    try {
      await api.put(`/posts/${postId}`, post);
      navigate(-1);
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update post.');
    }
  };

  const handleDiscard = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await api.get(`/posts/${postId}`);
        const post = response.data;

        setTitle(post.title || '');
        setContent(post.content || '');
        setTopic(post.topic || '');
      } catch (err) {
        console.error(err);
        setError('Failed to load post data.');
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchPostData();
  }, [postId]);

  if (loading) {
    return (
      <div className="mt-10 text-center text-gray-600">
        Loading post…
      </div>
    );
  }

  return (
    <div className="px-3 md:px-0">
      <div className="mx-auto max-w-3xl bg-white shadow-md mt-6 mb-10 p-4 md:p-8 rounded-sm">
        <h1 className="text-xl md:text-2xl font-semibold mb-6 md:mb-10">
          Update Post
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title + Topic */}
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 w-full rounded-sm"
              required
            />

            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="border p-3 w-full md:w-1/3 rounded-sm"
              required
            >
              <option value="">Select topic</option>
              <option value="Discussion">Discussion</option>
              <option value="Theory">Theory</option>
              <option value="Informational">Informational</option>
            </select>
          </div>

          {/* Content */}
          <textarea
            placeholder="Update your content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-3 rounded-sm resize-y min-h-[200px] md:min-h-[400px]"
            required
          />

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-3 md:justify-end pt-2">
            <button
              type="submit"
              className="w-full md:w-48 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded font-semibold"
            >
              Update
            </button>

            <button
              type="button"
              onClick={handleDiscard}
              className="w-full md:w-48 bg-red-400 hover:bg-red-500 text-white py-3 rounded font-semibold"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePost;

