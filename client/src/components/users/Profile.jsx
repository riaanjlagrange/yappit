import api from "../../utils/api";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import profilePicture from "../../assets/temp-profile.svg";
import PageLoadingSpinner from "../layout/PageLoadingSpinner";
import ProfilePicUpload from "./ProfilePicUpload";
import { Link } from "react-router-dom";
import UserPosts from "../posts/UserPosts";

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
    <div className="flex w-full h-full flex-col items-center pb-20">
      <div className="w-2/3 bg-white h-full flex flex-col p-8 rounded-sm gap-5 justify-evenly relative">
        <img
          src={profilePicUrl ? profilePicUrl : profilePicture}
          href="Profile Picture"
          className="max-w-32 rounded-sm"
        />
        <ul className="flex gap-2 absolute top-8 right-8">
          {/* TODO: need to add a color for each role in schema */}
          {profileUser.userRoles.map((role) => (
            <li
              className="p-2 text-sm rounded-sm bg-indigo-500 text-white"
              key={role.role.id}
            >
              {role.role.name}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <p className="font-semibold">{profileUser.name}</p>
            <p className="text-gray-700">({profileUser.email})</p>
          </div>
          <p className="text-gray-700 text-sm">
            Joined:{" "}
            {new Date(profileUser.created_at).toLocaleString("en-ZA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </p>
        </div>
        <p>{profileUser.description}</p>
        {isAuthor && (
          <Link
            to={`/users/${profileUserId}/settings`}
            className="bg-red-400 hover:bg-red-500 text-white p-2 rounded-sm absolute bottom-8 right-8"
          >
            Edit Profile
          </Link>
        )}
        {isAuthor && (
          <ProfilePicUpload fetchUser={getUser} userId={profileUser.id} />
        )}
      </div>
      <div className="flex flex-col mt-3 w-2/3 items-center">
        <div className="w-full">
          <h1 className="text-xl font-semibold mb-4">
            Latest from <span className="italic">{profileUser.name}</span>
          </h1>
          <UserPosts userId={profileUserId} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
