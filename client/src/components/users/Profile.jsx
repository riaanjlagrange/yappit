import api from "../../utils/api";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import profilePicture from "../../assets/temp-profile.svg";
import PageLoadingSpinner from "../layout/PageLoadingSpinner";
import ProfilePicUpload from "./ProfilePicUpload";

function Profile() {
  const [profileUser, setProfileUser] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const profileUserId = useParams().userId;

  // check if user is author
  const { user } = useAuth();
  const userId = user.id;

  const isAuthor = userId === profileUserId;
  console.log(userId);
  console.log(profileUserId);
  console.log(isAuthor);

  const getUser = async (profileUserId) => {
    try {
      const user = await api.get(`/users/${profileUserId}`);
      setProfileUser(user.data);
      setProfilePicUrl(user.data.profilePicUrl);
      console.log(user.data.profilePicUrl);
      console.log(user.data);
    } catch (err) {
      console.error(err);
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
    <div className="flex w-full h-full flex-col items-center">
      <div className="w-2/3 bg-white h-full flex items-center flex-col p-8 rounded-sm gap-5 justify-evenly">
        <img
          src={profilePicUrl ? profilePicUrl : profilePicture}
          href="Profile Picture"
          className="max-w-32"
        />
        <p>{profileUser.name}</p>
        <p>{profileUser.email}</p>
        <p>{profileUser.id}</p>
        <p>{profileUser.description}</p>
        {isAuthor && <div>You are the author</div>}
        {isAuthor && (
          <ProfilePicUpload fetchUser={getUser} userId={profileUser.id} />
        )}
      </div>
    </div>
  );
}

export default Profile;
