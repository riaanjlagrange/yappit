import { useState } from 'react';
import api from '../../utils/api';
import { FiUploadCloud } from 'react-icons/fi';

function ProfilePicUpload({ userId, fetchUser }) {
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccessMessage('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('profilePic', file);
    formData.append('userId', userId);

    try {
      const upload = await api.post('/upload/profilePic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Profile picture updated successfully! Refreshing...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err.message);
      setError(err.response?.data?.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
      // fetchUser is not a function passed down, but this is a good pattern
      // if (typeof fetchUser === 'function') {
      //   fetchUser(userId);
      // }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form
        encType="multipart/form-data"
        onSubmit={handleUpload}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <div className="flex flex-col items-center justify-center w-full mb-4">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FiUploadCloud className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
          </label>
          {file && (
            <p className="mt-2 text-sm font-medium text-gray-600">Selected file: {file.name}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isUploading || !file}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
        >
          {isUploading ? 'Uploading...' : 'Upload Picture'}
        </button>

        {successMessage && (
          <p className="mt-4 text-center text-indigo-500 font-semibold">{successMessage}</p>
        )}
        {error && <p className="mt-4 text-center text-red-400 font-semibold">{error}</p>}
      </form>
    </div>
  );
}

export default ProfilePicUpload;
