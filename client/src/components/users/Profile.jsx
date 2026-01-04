import api from '../../utils/api';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useParams, Link } from 'react-router-dom';
import profilePicture from '../../assets/temp-profile.svg';
import PageLoadingSpinner from '../layout/PageLoadingSpinner';
import UserPosts from '../posts/UserPosts';

function Profile() {
  const [profileUser, setProfileUser] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const { userId: profileUserId } = useParams();
  const { user } = useAuth();

  const isAuthor = user?.id === profileUserId;

  const getUser = async (id) => {
    try {
      const res = await api.get(`/users/${id}`);
      setProfileUser(res.data);
      setProfilePicUrl(res.data.profilePic);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser(profileUserId);
  }, [profileUserId]);

  if (loading) return <PageLoadingSpinner />;
  if (errorMessage) return <div>{errorMessage}</div>;

  return (
    <div className="w-full flex flex-col items-center pb-20 px-3 md:px-0">
      {/* Profile Card */}
      <div className="w-full max-w-4xl bg-white rounded-sm shadow-md p-4 md:p-8 relative">
        {/* Top section */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Profile Picture */}
          <div className="flex justify-start">
            <img
              src={profilePicUrl || profilePicture}
              alt="Profile"
              className="w-28 h-28 md:w-32 md:h-32 rounded-sm object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Name + email */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <p className="font-semibold text-lg">{profileUser.name}</p>
              <p className="text-gray-600 text-sm break-all">
                ({profileUser.email})
              </p>
            </div>

            {/* Joined */}
            <p className="text-gray-700 text-sm">
              Joined:{' '}
              {new Date(profileUser.created_at).toLocaleDateString('en-ZA')}
            </p>

            {/* Roles */}
            <ul className="flex flex-wrap gap-2 mt-2">
              {profileUser.userRoles.map((role) => (
                <li
                  key={role.role.id}
                  className="px-3 py-1 text-xs rounded-sm bg-indigo-500 text-white"
                >
                  {role.role.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Description */}
        {profileUser.description && (
          <p className="mt-5 text-sm md:text-base text-gray-800">
            {profileUser.description}
          </p>
        )}

        {/* Edit Button */}
        {isAuthor && (
          <div className="mt-6 md:mt-0 md:absolute md:bottom-8 md:right-8">
            <Link
              to={`/users/${profileUserId}/settings`}
              className="block w-full md:w-auto text-center bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-sm font-semibold"
            >
              Edit Profile
            </Link>
          </div>
        )}
      </div>

      {/* User Posts */}
      <div className="w-full max-w-4xl mt-6">
        <UserPosts userId={profileUserId} />
      </div>
    </div>
  );
}

export default Profile;

