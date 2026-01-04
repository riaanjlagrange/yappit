import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import ErrorButton from './SentryError.jsx';
import { ErrorBoundary } from '@sentry/react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="text-center">
        <img src={logo} alt="Yappit Logo" className="w-48 h-48 mx-auto mb-8" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Yappit</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          Yappit is a community-driven platform where you can share and discover interesting content, engage in discussions, and connect with like-minded people.
        </p>
        <Link
          to="/posts"
          className="bg-indigo-500 text-white hover:bg-indigo-600 px-8 py-3 rounded-md text-lg font-semibold transition-colors"
        >
          Explore Posts
        </Link>
	<ErrorBoundary>
	  <ErrorButton />
	</ErrorBoundary>
      </div>
    </div>
  );
};

export default Home;
