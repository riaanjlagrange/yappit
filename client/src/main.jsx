import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AllPosts from "./components/posts/AllPosts.jsx";
import CreatePost from "./components/posts/CreatePost.jsx";
import Register from "./components/auth/Register.jsx";
import Login from "./components/auth/Login.jsx";
import RequireAuth from "./components/auth/RequireAuth.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/posts",
        element: <AllPosts />,
      },
      {
        path: "/posts/new",
        element: (
          <RequireAuth>
            <CreatePost />
          </RequireAuth>
        ),
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
