import { FaComment } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function CommentAnnotation({ postId, commentCount }) {
  return (
    <Link to={`/posts/${postId}#comments`} className="flex items-center gap-2">
      <FaComment className="text-gray-500 size-5" />
      <span className="text-gray-500 text-sm">{commentCount}</span>
    </Link>
  );
}

export default CommentAnnotation;
