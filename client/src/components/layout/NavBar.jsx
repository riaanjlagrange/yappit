import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import getUserById from '../../utils/getUserById';
import logo from '../../assets/logo.svg';
import tempProfilePicture from '../../assets/temp-profile.svg';
import { CiLogout, CiLogin } from 'react-icons/ci';
import { FaUserPlus } from 'react-icons/fa';
import { MdPostAdd } from 'react-icons/md';
import { HiMenu, HiX } from 'react-icons/hi';

function NavBar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [userName, setUserName] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const getUser = async (userId) => {
    try {
      const user = await getUserById(userId);
      if (!user) {
        setUserError('User not found');
        return;
      }
      setUserName(user.name);
      setProfilePicUrl(user.profilePic);
    } catch (error) {
      setUserError('Failed to load user');
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) getUser(user.id);
    else setUserLoading(false);
  }, [user]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const UserSection = () => {
    if (!isLoggedIn) return null;

    if (userLoading) return <p className="text-sm">Loading...</p>;
    if (userError) return <p className="text-red-400">{userError}</p>;

    return (
      <div className="flex items-center gap-3">
        <Link to={`/users/${user.id}`} onClick={() => setMenuOpen(false)}>
          <img
            src={profilePicUrl || tempProfilePicture}
            className="w-10 h-10 rounded-sm"
          />
        </Link>

        <div className="flex flex-col">
          <Link
            to={`/users/${user.id}`}
            className="font-semibold text-sm hover:text-indigo-600"
            onClick={() => setMenuOpen(false)}
          >
            {userName || 'Unknown User'}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-500"
          >
            <CiLogout />
            Logout
          </button>
        </div>
      </div>
    );
  };

  return (
    <nav className="fixed top-0 z-10 w-full bg-white shadow-md">
      <div className="flex h-20 items-center justify-between px-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-12 h-12" />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6">
          {isLoggedIn && (
            <li>
              <Link
                to="/posts/new"
                className="flex items-center gap-2 bg-red-400 px-3 py-2 rounded text-white font-semibold hover:bg-red-500"
              >
                <MdPostAdd />
                Create Post
              </Link>
            </li>
          )}

          <li>
            <Link to="/posts" className="hover:text-red-400">
              All Posts
            </Link>
          </li>

          {isLoggedIn && (
            <li>
              <Link to={`/users/${user.id}/posts`} className="hover:text-red-400">
                My Posts
              </Link>
            </li>
          )}

          {!isLoggedIn && (
            <>
              <li>
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-indigo-500 px-3 py-2 rounded text-white font-semibold hover:bg-indigo-600"
                >
                  <CiLogin /> Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-red-400 px-3 py-2 rounded text-white font-semibold hover:bg-red-500"
                >
                  <FaUserPlus /> Register
                </Link>
              </li>
            </>
          )}

          <li>
            <UserSection />
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-5 py-4 space-y-4">
          {isLoggedIn && (
            <Link
              to="/posts/new"
              className="flex items-center gap-2 bg-red-400 px-4 py-3 rounded text-white font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              <MdPostAdd /> Create Post
            </Link>
          )}

          <Link
            to="/posts"
            className="block py-2 text-lg"
            onClick={() => setMenuOpen(false)}
          >
            All Posts
          </Link>

          {isLoggedIn && (
            <Link
              to={`/users/${user.id}/posts`}
              className="block py-2 text-lg"
              onClick={() => setMenuOpen(false)}
            >
              My Posts
            </Link>
          )}

          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="block bg-indigo-500 text-white px-4 py-3 rounded font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block bg-red-400 text-white px-4 py-3 rounded font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}

          <UserSection />
        </div>
      )}
    </nav>
  );
}

export default NavBar;

