import ProfilePicUpload from "./ProfilePicUpload";

function Settings() {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="flex flex-col gap-5 w-1/2">
        <h1>Settings</h1>
        <ProfilePicUpload />
        <div className="bg-white shadow-md rounded px-4">
          <h2 className="text-2xl font-bold mb-4">User Settings</h2>
        </div>
        <div className="bg-white shadow-md rounded px-4">
          <h2 className="text-2xl font-bold mb-4">User Settings</h2>
        </div>
      </div>
    </div>
  );
}

export default Settings;
