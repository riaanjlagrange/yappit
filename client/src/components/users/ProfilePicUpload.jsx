import { useState } from 'react';
import api from '../../utils/api';

function ProfilePicUpload({ userId, fetchUser }) {
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('profilePic', file);
    formData.append('userId', userId);

    try {
      const upload = await api.post('/upload/profilePic', formData);
      // refresh the browser
      setTimeout(() => {
        // this works but not ideal. need to replace TODO
        window.location.reload();
      }, 1000);
      const { message, imageUrl } = await upload;
      setSuccessMessage(message);
      console.log(imageUrl);
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    } finally {
      fetchUser(userId);
    }
  };

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleUpload}
      className="bg-white flex items-center gap-4 p-4 rounded-lg shadow-md w-full max-w-md"
    >
      <label className="w-full">
        <span className="block text-sm font-medium text-gray-700 mb-1">Upload Profile Picture</span>
        <input
          type="file"
          name="profilePic"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0 file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-500 hover:file:bg-indigo-100"
        />
      </label>

      <button
        type="submit"
        className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg"
      >
        Upload
      </button>

      {successMessage && <span>{successMessage}</span>}
      {error && <span>{error}</span>}
    </form>
  );
}

export default ProfilePicUpload;
