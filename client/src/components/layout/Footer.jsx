import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
        <p>Created by Your Name</p>
      </div>
    </footer>
  );
}

export default Footer;
