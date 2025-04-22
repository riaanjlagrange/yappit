import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) return null;

      return decoded;
    } catch {
      return null;
    }
  }, [token]);

  return { user, isLoggedIn: !!user };
};

export default useAuth;
