import { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles, setRoles] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [logoutTimer, setLogoutTimer] = useState(null);

  // Helper: logout user and clear state

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsModerator(false);
    setRoles();
    if (logoutTimer) clearTimeout(logoutTimer);
  };

  // Helper: login user and schedule auto-logout
  const login = (token) => {
    localStorage.setItem('token', token);
    try {
      const decoded = jwtDecode(token);
      setIsLoggedIn(true);
      setUser(decoded);
      setRoles(decoded.roles || []);
      setIsAdmin(decoded.roles.includes('ADMIN'));
      setIsModerator(decoded.roles.includes('MODERATOR'));

      // Schedule logout when token expires
      const timeUntilExpiry = decoded.exp * 1000 - Date.now();
      const timer = setTimeout(() => {
        logout();
      }, timeUntilExpiry);
      setLogoutTimer(timer);
    } catch (err) {
      console.error('Invalid token', err);
      logout();
    }
  };

  // On initial load, check if token exists and is valid
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        logout();
      } else {
        setIsLoggedIn(true);
        setUser(decoded);
        setRoles(decoded.roles || []);
        setIsAdmin(decoded.roles.includes('ADMIN'));
        setIsModerator(decoded.roles.includes('MODERATOR'));

        // Schedule logout
        const timer = setTimeout(
          () => {
            logout();
          },
          decoded.exp * 1000 - Date.now(),
        );
        setLogoutTimer(timer);
      }
    } catch {
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, roles, isAdmin, isModerator, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
