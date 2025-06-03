import ProfilePicUpload from "./ProfilePicUpload";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth"

function Settings() {
  const [name, setName] = useState("")
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {


  }, [])

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="flex flex-col gap-5 w-1/2">
        <h1>Settings</h1>
        <div className="bg-white shadow-md rounded px-4 flex flex-col items-center">
          <ProfilePicUpload />
        </div>
      </div>
    </div>
  );
}

export default Settings;
