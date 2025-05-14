import { useState } from "react";
import api from "../../utils/api";

function ProfilePicUpload({ userId, fetchUser }) {
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profilePic", file);
    formData.append("userId", userId);

    try {
      const upload = await api.post("/upload/profilePic", formData);
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
    <form encType="multipart/form-data" onSubmit={handleUpload}>
      <input
        type="file"
        name="profilePic"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">Upload</button>
      {successMessage && <span>{successMessage}</span>}
      {error && <span>{error}</span>}
    </form>
  );
}

export default ProfilePicUpload;
