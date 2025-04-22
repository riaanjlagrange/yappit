import React from "react";
import { Link } from "react-router-dom";
// TODO: change Link to NavLink

function NavBar() {
  return (
    <div>
      <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
        <div className="text-lg font-bold">My Blog</div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-gray-400">
              Home
            </Link>
          </li>
          <li>
            <Link to="/posts" className="hover:text-gray-400">
              Posts
            </Link>
          </li>
          <li>
            <Link to="/posts/new" className="hover:text-gray-400">
              New Post
            </Link>
          </li>
          <li>
            <Link to="/users" className="hover:text-gray-400">
              Users
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
