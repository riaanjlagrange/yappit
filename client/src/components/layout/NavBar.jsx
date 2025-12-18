import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import getUserById from '../../utils/getUserById';
import logo from '../../assets/logo.svg';
import tempProfilePicture from '../../assets/temp-profile.svg'; // Placeholder for profile picture
import { CiLogout, CiLogin } from 'react-icons/ci';
import { FaUserPlus } from 'react-icons/fa';
import { MdPostAdd } from 'react-icons/md';
// TODO: change Link to NavLink

function NavBar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [userName, setUserName] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  // Get user name by user id
  const getUser = async (userId) => {
    try {
      const user = await getUserById(userId);
      if (!user) {
        setUserError('User not found');
        return;
      }
      setUserName(user.name);
      setProfilePicUrl(user.profilePicUrl);
      setUserLoading(false);
      return user;
    } catch (error) {
      setUserError(error);
      setUserLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      getUser(user.id);
    } else {
      setUserLoading(false);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  // Add profile picture in future
  const showUser = () => {
    if (isLoggedIn) {
      if (userLoading) {
        return (
          <li>
            <span>Loading...</span>
          </li>
        );
      } else if (userError) {
        return (
          <li>
            <p className="text-red-500">{userError}</p>
          </li>
        );
      } else {
        return (
          <li className="flex items-center space-x-2 gap-3">
            <div className="flex flex-col items-end justify-center space-between">
              <Link to={`/users/${user.id}`} className="hover:text-indigo-600 font-bold">
                {userName || 'Unknown User'}
              </Link>
              <button
                className="text-gray-600 hover:text-gray-500 cursor-pointer italic flex gap-2 items-center"
                onClick={handleLogout}
              >
                <CiLogout />
                <span>Logout</span>
              </button>
            </div>
            <Link to={`/users/${user.id}`}>
              <img src={profilePicUrl || tempProfilePicture} className="w-10 h-10 rounded-sm" />
            </Link>
          </li>
        );
      }
    }
  };

  return (
    <nav className="fixed bg-white w-full h-20 top-0 flex justify-between items-center px-5 shadow-md z-10">
      <ul className="flex space-x-4 items-center justify-center gap-5">
        <Link to="/posts" className="text-2xl font-bold text-gray-800">
          <img src={logo} alt="Logo" className="w-12 h-12" />
        </Link>
        {/* Show "Create Post" link only if the user is logged in */}
        {isLoggedIn && (
          <li>
            <Link
              to="/posts/new"
              // className="bg-gradient-to-br from-blue-600 via-pink-500 to-orange-400 text-white hover:bg-white p-3 rounded font-semibold"
              className="text-white bg-red-400 hover:bg-red-500 p-3 rounded font-semibold flex items-center justify-center gap-2"
              style={{ transition: 'all 0.3s ease' }}
            >
              <MdPostAdd />
              <span>Create Post</span>
            </Link>
          </li>
        )}

        <li>
          <Link to="/posts" className="hover:text-red-400">
            All Posts
          </Link>
        </li>

        {/* Show "My Posts" link only if the user is logged in */}
        {isLoggedIn && (
          <li>
            <Link to={`/users/${user.id}/posts`} className="hover:text-red-400">
              My Posts
            </Link>
          </li>
        )}
      </ul>
      <ul className="flex space-x-4">
        {showUser()}
        {/* Show "Login" link only if the user is not logged in */}
        {!isLoggedIn && (
          <li>
            <Link
              to="/login"
              className="bg-indigo-500 text-white hover:bg-indigo-600 px-4 py-2 rounded-sm flex items-center gap-2 font-semibold"
            >
              <CiLogin />
              <span>Login</span>
            </Link>
          </li>
        )}
        {/* Show "Register" link only if the user is not logged in */}
        {!isLoggedIn && (
          <li>
            <Link
              to="/register"
              className="bg-red-400 text-white hover:bg-red-500 px-4 py-2 rounded-sm flex items-center gap-2 font-semibold"
            >
              <FaUserPlus />
              <span>Register</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
