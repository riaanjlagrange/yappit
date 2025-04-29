import { Link } from "react-router-dom";

function AdminPanel() {
  return (
    <div className="admin-panel">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <p className="mb-4">Manage your application settings and content here.</p>
      <div className="flex flex-col gap-4">
        <Link
          to="/admin/users"
          className="text-indigo-500 hover:underline hover:text-red-400"
        >
          Manage Users
        </Link>
        <Link
          to="/admin/posts"
          className="text-indigo-500 hover:underline hover:text-red-400"
        >
          Manage Posts
        </Link>
        <Link
          to="/admin/comments"
          className="text-indigo-500 hover:underline hover:text-red-400"
        >
          Manage Comments
        </Link>
      </div>
    </div>
  );
}

export default AdminPanel;
