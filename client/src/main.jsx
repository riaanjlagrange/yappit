import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AllPosts from "./components/posts/AllPosts.jsx";
import CreatePost from "./components/posts/CreatePost.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/posts",
        element: <AllPosts />,
        errorElement: <div>Error loading posts</div>,
      },
      {
        path: "/posts/new",
        element: <CreatePost />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
