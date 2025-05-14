import { useState, useEffect } from "react";
import getUserById from "../../utils/getUserById";
import ContentLoadingSpinner from "../layout/ContentLoadingSpinner";
import tempProfilePic from "../../assets/temp-profile.svg";
import getTimeAgo from "../../utils/getTimeAgo";
import { Link } from "react-router-dom";

function UserCard({ userId, createdAt }) {
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const postedTimeAgo = getTimeAgo(createdAt);

  useEffect(() => {
    const getUser = async (userId) => {
      try {
        const user = await getUserById(userId);
        if (!user) {
          console.error("User not found");
          return;
        }
        setProfilePicUrl(user.profilePicUrl);
        setAuthor(user.name);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getUser(userId);
    }
  }, [userId]);

  if (loading) return <ContentLoadingSpinner />;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex items-center mb-2">
      <img
        src={profilePicUrl || tempProfilePic}
        alt="profile picture"
        className="size-8 mr-3 rounded-full"
      />
      <Link
        to={`/users/${userId}`}
        className="font-bold hover:underline hover:text-red-400"
      >
        {author}
      </Link>
      <span className="text-gray-500 text-sm italic ml-2">
        ({postedTimeAgo})
      </span>
    </div>
  );
}

export default UserCard;
