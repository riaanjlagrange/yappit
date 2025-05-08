import api from "../../utils/api";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const { userId } = useParams();

  useEffect(() => {
    const getUser = async (userId) => {
      try {
        const user = await api.get(`/users/${userId}`);
        setUser(user.data);
        console.log(user);
      } catch (err) {
        console.error(err);
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    getUser(userId);
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (errorMessage) return <div>{errorMessage}</div>;

  return (
    <div className="flex w-full h-full flex-col items-center">
      <div className="w-2/3 bg-white h-full flex items-center flex-col p-8 rounded-sm">
        <p>{user.name}</p>
        <p>{user.email}</p>
        <p>{user.id}</p>
      </div>
    </div>
  );
}

export default Profile;
