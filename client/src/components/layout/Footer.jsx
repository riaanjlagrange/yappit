import logo from '../../assets/logo.svg';
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full bg-gray-200 py-6 mt-8 flex gap-10 justify-center items-center">
      <Link to="/" className="text-2xl font-bold text-gray-800">
	<img src={logo} alt="Logo" className="w-12 h-12" />
      </Link>
      <div className="flex flex-col items-center">
        <p className="text-sm mb-2">
          © {new Date().getFullYear()} Yappit
        </p>
        <p className="text-xs text-gray-700 mb-2">
          Built by{' '}
          <a
            href="https://github.com/riaanjlagrange"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-red-400 hover:underline"
          >
            riaanjlagrange
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
