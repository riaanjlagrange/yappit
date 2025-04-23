import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import logout from "../../utils/logout";
import getUserNameById from "../../utils/getUserById";
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
          <li className="flex flex-col items-center space-between">
            <Link to={`/users/${user.id}`} className="hover:text-gray-400">
              {userName || "Unknown User"}
            </Link>
            <button
              className="hover:text-gray-400 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        );
      }
    }
  };

  return (
    <nav className="bg-gray-800 text-white fixed w-full h-20 top-0 flex justify-between items-center px-5">
      <ul className="flex space-x-4">
        <li>
          <Link to="/posts" className="hover:text-gray-400">
            All Posts
          </Link>
        </li>

        {/* Show "Create Post" link only if the user is logged in */}
        {isLoggedIn && (
          <li>
            <Link to="/posts/new" className="hover:text-gray-400">
              Create Post
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
