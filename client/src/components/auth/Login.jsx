import { useState, useEffect } from "react";
import api from "../../utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// TODO: add validation for email and password from client side

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(null);

  // check where the user is coming from
  const location = useLocation();
  const from = location.state?.from?.pathname || "/posts";

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

    // Validate form data and log in
    try {
      const res = await api.post("/auth/login", formData);
      setMessage("Login successful!");
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      window.location.reload();
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        {message && (
          <div className="mb-4 text-sm text-center text-red-400">{message}</div>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-16 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-500 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
