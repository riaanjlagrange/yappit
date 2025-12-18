import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white fixed right-0 bottom-0 w-1/8 flex justify-evenly items-center py-4 gap-3 rounded-tl">
      <img src={logo} alt="Yappit Logo" className="w-1/4 h-1/4" />
      <div className="text-center">
        <p className="text-sm">
          © 2025 <span className="font-extrabold text-indigo-500">Yapp</span>
          <span className="font-bold text-red-400">it</span>
        </p>
        <p className="text-sm">Made by</p>
        {/* Add github logo here */}
        <a
          href="https://github.com/riaanjlagrange"
          target="_blank"
          className="text-sm font-semibold hover:text-red-400 hover:underline pageTitle"
        >
          riaanjlagrange
        </a>
      </div>
    </footer>
  );
}

export default Footer;
