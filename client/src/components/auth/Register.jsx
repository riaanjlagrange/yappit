import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { CiLogin } from 'react-icons/ci';
import { FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState(null);

  // check where the user is coming from
  const location = useLocation();
  const from = location.state?.from?.pathname || '/posts';

  const navigate = useNavigate();

  // if already logged in, redirect to previous page
  const { isLoggedIn } = useAuth();
  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, from, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/register', formData);
      setMessage('Registration successful!');
      console.log(res.data);
      navigate('/login', { replace: true });
    } catch (err) {
      // TODO: show appropriate error message to user like if email already exists
      console.error(err);
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Register</h2>

        <input
          name="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-indigo-50"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-indigo-50"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-indigo-50"
          required
        />

        {message && <div className="text-sm text-center text-red-400">{message}</div>}

        <button
          type="submit"
          className="w-full mt-5 bg-red-400 text-white py-3 rounded hover:bg-red-500 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <FaUserPlus />
          <span>Register</span>
        </button>
        <div className="flex flex-col items-center justify-between mt-4">
          <span className="text-sm text-gray-500 mt-2 mb-1">Don't have an account? </span>
          <Link
            to="/login"
            className="w-full bg-indigo-500 text-white py-3 rounded hover:bg-indigo-600 transition text-center flex items-center justify-center gap-2"
          >
            <CiLogin />
            <span>Login here</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
