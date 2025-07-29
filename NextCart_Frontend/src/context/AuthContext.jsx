import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return null;
      }
      return payload;
    } catch (err) {
      console.error("Invalid token");
      return null;
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = decodeToken(token);
    
    
    if (decoded) {
      setUser(decoded);
      localStorage.setItem("isAdmin", decoded.isAdmin);
      localStorage.setItem("isSuperAdmin", decoded.role === "superadmin");
    } else {
      logout();
    }
  };

  const logout = () => {
   
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isSuperAdmin");
    
    
    if (user?.id) {
      localStorage.removeItem(`cart_${user.id}`);
    }
    
    setUser(null);
    sessionStorage.removeItem("hasWelcomed");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      
      if (decoded) {
        setUser(decoded);
        localStorage.setItem("isAdmin", decoded.isAdmin);
        localStorage.setItem("isSuperAdmin", decoded.role === "superadmin");
      } else {
       
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("isSuperAdmin");
      }
    }
    setIsAuthReady(true);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);