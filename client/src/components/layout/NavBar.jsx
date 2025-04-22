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

  return (
    <div>
      <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
        <div className="text-lg font-bold">My Blog</div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/posts" className="hover:text-gray-400">
              All Posts
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/posts/new" className="hover:text-gray-400">
                  Create Post
                </Link>
              </li>
              <li>
                {userLoading ? (
                  <span>Loading...</span>
                ) : userError ? (
                  <p className="text-red-500">{userError}</p>
                ) : (
                  <Link
                    to={`/users/${user.id}`}
                    className="hover:text-gray-400"
                  >
                    {userName || "Unknown User"}
                  </Link>
                )}
              </li>
              <li>
                <button className="hover:text-gray-400" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register" className="hover:text-gray-400">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gray-400">
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
