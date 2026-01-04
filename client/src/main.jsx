import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import AllPosts from './components/posts/AllPosts.jsx';
import CreatePost from './components/posts/CreatePost.jsx';
import Register from './components/auth/Register.jsx';
import Login from './components/auth/Login.jsx';
import RequireAuth from './components/auth/RequireAuth.jsx';
import RequireAdmin from './components/auth/RequireAdmin.jsx';
import UpdatePost from './components/posts/UpdatePost.jsx';
import FullPost from './components/posts/FullPost.jsx';
import MyPosts from './components/posts/MyPosts.jsx';
import NotFoundPage from './components/layout/NotFoundPage.jsx';
import AdminPanel from './components/admin/AdminPanel.jsx';
import ManageUsers from './components/admin/ManageUsers.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import AssignAdmin from './components/auth/AssignAdmin.jsx';
import Profile from './components/users/Profile.jsx';
import Settings from './components/users/Settings.jsx';
import Root from './components/layout/Root.jsx';

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://32b35809feb1ccdb815875ddbc9b62bd@o4510334692950016.ingest.de.sentry.io/4510652794732624",
  sendDefaultPii: true,
});

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      { path: '/', element: <Root /> },
      { path: '/posts', element: <AllPosts /> },
      {
        path: '/posts/new',
        element: (
          <RequireAuth>
            <CreatePost />
          </RequireAuth>
        ),
      },
      { path: '/posts/:postId', element: <FullPost /> },
      {
        path: '/users/:userName/posts',
        element: (
          <RequireAuth>
            <MyPosts />
          </RequireAuth>
        ),
      },
      {
        path: '/users/:userId',
        element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>
        ),
      },
      {
        path: '/users/:userId/settings',
        element: (
          <RequireAuth>
            <Settings />
          </RequireAuth>
        ),
      },
      {
        path: '/posts/:postId/update',
        element: (
          <RequireAuth>
            <UpdatePost />
          </RequireAuth>
        ),
      },
      { path: '/register', element: <Register /> },
      { path: '/login', element: <Login /> },
      {
        path: '/admin',
        element: (
          <RequireAdmin>
            <AdminPanel />
          </RequireAdmin>
        ),
      },
      {
        path: '/admin/users',
        element: (
          <RequireAdmin>
            <ManageUsers />
          </RequireAdmin>
        ),
      },
      {
        path: '/admin/assign',
        element: (
          <RequireAuth>
            <AssignAdmin />
          </RequireAuth>
        ),
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

