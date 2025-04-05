import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData)); 
    setUser(userData);
 // Redirect user based on role after login
 setTimeout(() => {
    if (userData.role === "admin") {
      navigate("/admin-dashboard", { replace: true });
    } else {
      navigate("/student-dashboard", { replace: true });
    }
  }, 100);
};
  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login",{replace:true});
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
