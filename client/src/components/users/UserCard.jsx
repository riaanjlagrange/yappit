import tempProfilePic from '../../assets/temp-profile.svg';
import getTimeAgo from '../../utils/getTimeAgo';
import { Link } from 'react-router-dom';

function UserCard({ userId, authorName, authorProfilePic, createdAt = null }) {
  const postedTimeAgo = getTimeAgo(createdAt);

  return (
    <div className="flex items-center mb-2">
      <img src={authorProfilePic || tempProfilePic} className="size-8 mr-3 rounded-sm" />
      <Link to={`/users/${userId}`} className="font-bold hover:underline hover:text-red-400">
        {authorName}
      </Link>
      {createdAt && <span className="text-gray-500 text-sm italic ml-2">({postedTimeAgo})</span>}
    </div>
  );
}

export default UserCard;
