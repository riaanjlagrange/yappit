import api from "../../utils/api";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import profilePicture from "../../assets/temp-profile.svg";

function Profile() {
  const [profileUser, setProfileUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // get userId from params in as int
  const profileUserId = parseInt(useParams().userId);

  // check if user is author
  const { user } = useAuth();
  const userId = user.id;

  const isAuthor = userId === profileUserId;
  console.log(userId);
  console.log(profileUserId);
  console.log(isAuthor);

  useEffect(() => {
    const getUser = async (profileUserId) => {
      try {
        const user = await api.get(`/users/${profileUserId}`);
        setProfileUser(user.data);
        console.log(user);
      } catch (err) {
        console.error(err);
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    getUser(profileUserId);
  }, [profileUserId]);

  if (loading) return <div>Loading...</div>;
  if (errorMessage) return <div>{errorMessage}</div>;

  return (
    <div className="flex w-full h-full flex-col items-center">
      <div className="w-2/3 bg-white h-full flex items-center flex-col p-8 rounded-sm gap-5 justify-evenly">
        <img src={profilePicture} href="Profile Picture" className="max-w-32" />
        <p>{profileUser.name}</p>
        <p>{profileUser.email}</p>
        <p>{profileUser.id}</p>
        <p>{profileUser.description}</p>
        {isAuthor && <div>You are the author</div>}
      </div>
    </div>
  );
}

export default Profile;
