import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Home from './Home';

const Root = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/posts" replace />;
  }

  return <Home />;
};

export default Root;
