import ProfilePicUpload from './ProfilePicUpload';
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import useAuth from '../../hooks/useAuth';
import PageLoadingSpinner from '../layout/PageLoadingSpinner';

function Settings() {
  const [name, setName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const { user, isLoggedIn } = useAuth(); // user from useAuth only has id, email, roles

  // Fetch full user profile on mount
  useEffect(() => {
    if (user && user.id) {
      api
        .get(`/users/${user.id}`)
        .then((res) => {
          setName(res.data.name);
          setLoading(false);
        })
        .catch((err) => {
          setErrorMessage('Failed to load user data.');
          setLoading(false);
        });
    }
  }, [user]);

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await api.put(`/users/${user.id}`, { name });
      if (response.data) {
        setSuccessMessage('Username updated successfully!');
	setTimeout(() => {
	  window.location.reload();
	}, 2000);
      }
    } catch (err) {
      setErrorMessage('Failed to update username. Please try again.');
      console.error(err);
    }
  };

  if (loading) return <PageLoadingSpinner />;
  if (!isLoggedIn) return <p>You must be logged in to view settings.</p>;

  return (
    <div className="flex w-full h-full justify-center items-start pt-10">
      <div className="flex flex-col gap-10 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Account Settings</h1>

        {/* Username Update Form */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Change Username</h2>
          <form onSubmit={handleUsernameUpdate}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all cursor-pointer"
            >
              Save Username
            </button>
            {successMessage && !errorMessage && (
              <p className="mt-4 text-center text-indigo-500 font-semibold">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="mt-4 text-center text-red-400 font-semibold">{errorMessage}</p>
            )}
          </form>
        </div>

        {/* Profile Picture Upload */}
        <ProfilePicUpload userId={user.id} />
      </div>
    </div>
  );
}

export default Settings;
