// Storage for user authentication and token management
//   <AuthProvider> , which wraps the entire application
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  // Load from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Persist accessToken and user to localStorage when updated
  useEffect(() => {
    if (accessToken && user) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }, [accessToken, user]);

  const login = (token, userInfo) => {
    setAccessToken(token);
    setUser(userInfo);
    toast.success(`Welcome back, ${userInfo.username}!`);
  };

  const logout = (navigate) => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    toast.success('You have successfully logged out!');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

