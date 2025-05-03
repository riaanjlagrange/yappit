import { Navigate, useLocation } from "react-router-dom"; import useAuth from "../../hooks/useAuth";

const RequireAdmin = ({ children }) => {
  const { user, roles } = useAuth();
  const location = useLocation();

  // so that user data can load in first
  if (!user) {
    return null;
  }

  const isAdmin = roles.includes('ADMIN');
  console.log(user)
  console.log(roles)
  console.log(isAdmin)

  if (!isAdmin) {
    console.log("You are not an admin")
    return <Navigate to="/posts" state={{ from: location }} replace />;
  }
  return children;
};

export default RequireAdmin;
