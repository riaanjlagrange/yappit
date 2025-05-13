import { useState, useEffect } from "react";
import api from "../../utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
import { FaUserPlus } from "react-icons/fa";

// TODO: add validation for email and password from client side
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // set message to show success or error message to user
  const [message, setMessage] = useState(null);

  // check where the user is coming from
  const location = useLocation();
  const from = location.state?.from?.pathname || "/posts";
  const navigate = useNavigate();

  // useAuth to get auth from AuthContext
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    // if already logged in, redirect to previous page
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

    // Validate form data and log in
    try {
      const res = await api.post("/auth/login", formData);
      setMessage("Login successful!");
      // use login from context to manage auth
      login(res.data.token);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-md w-full max-w-md rounded"
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>

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
          className="w-full mb-3 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-indigo-50"
          required
        />
        {message && (
          <div className="text-sm text-center text-red-400">{message}</div>
        )}

        <button
          type="submit"
          className="w-full mt-5 bg-indigo-500 text-white py-3 rounded hover:bg-indigo-600 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <CiLogin />
          <span>Login</span>
        </button>
        <div className="flex flex-col items-center justify-between mt-4">
          <span className="text-sm text-gray-500 mt-2 mb-1">
            Don't have an account?{" "}
          </span>
          <Link
            to="/register"
            className="w-full bg-red-400 text-white py-3 rounded hover:bg-red-500 transition flex items-center justify-center gap-2"
          >
            <FaUserPlus />
            <span>Register Here</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
