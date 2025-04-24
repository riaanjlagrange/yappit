import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import logout from "../../utils/logout";
import getUserNameById from "../../utils/getUserById";
import logo from "../../assets/logo.svg";
import profilePicture from "../../assets/temp-profile.svg"; // Placeholder for profile picture
// TODO: change Link to NavLink

function NavBar() {
  const { user, isLoggedIn } = useAuth();
  const [userName, setUserName] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  // Get user name by user id
  const getUserName = async (userId) => {
    try {
      const userName = await getUserNameById(userId);
      if (!userName) {
        setUserError("User not found");
        return;
      }
      setUserName(userName);
      setUserLoading(false);
      return userName;
    } catch (error) {
      setUserError(error);
      setUserLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      getUserName(user.id);
    } else {
      setUserLoading(false);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    window.location.reload();
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
              <Link
                to={`/users/${user.id}`}
                className="hover:text-gray-400 font-bold"
              >
                {userName || "Unknown User"}
              </Link>
              <button
                className="text-gray-600 hover:text-gray-500 cursor-pointer italic"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
            <Link to={`/users/${user.id}`}>
              <img
                src={profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            </Link>
          </li>
        );
      }
    }
  };

  return (
    <nav className="bg-white fixed w-full h-20 top-0 flex justify-between items-center px-5 shadow-md z-10">
      <ul className="flex space-x-4 items-center justify-center gap-5">
        <Link to="/posts" className="text-2xl font-bold text-gray-800">
          <img src={logo} alt="Logo" className="w-12 h-12" />
        </Link>
        {/* Show "Create Post" link only if the user is logged in */}
        {isLoggedIn && (
          <li>
            <Link
              to="/posts/new"
              className="text-white hover:text-blue-500 bg-blue-500 hover:bg-white p-2 rounded border-2 border-blue-500 font-semibold"
              style={{ transition: "all 0.3s ease" }}
            >
              Create Post
            </Link>
          </li>
        )}

        <li>
          <Link to="/posts" className="hover:text-gray-400">
            All Posts
          </Link>
        </li>

        {/* Show "My Posts" link only if the user is logged in */}
        {isLoggedIn && (
          <li>
            <Link to={`/posts/user/${user.id}`} className="hover:text-gray-400">
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
            <Link to="/login" className="hover:text-gray-400">
              Login
            </Link>
          </li>
        )}
        {/* Show "Register" link only if the user is not logged in */}
        {!isLoggedIn && (
          <li>
            <Link to="/register" className="hover:text-gray-400">
              Register
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
