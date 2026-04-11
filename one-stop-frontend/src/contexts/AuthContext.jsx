import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('onestop_token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch the current user on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          // Token invalid or expired
          logout();
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('onestop_token', data.token);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: "Network Error: Could not connect to the backend server." };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('onestop_token', data.token);
        return { success: true, user: data.user };
      }
      // Handle express-validator errors array
      const message = data.errors ? data.errors[0].message : data.message;
      return { success: false, message };
    } catch (error) {
      return { success: false, message: "Network Error: Could not connect to the backend server." };
    }
  };

  const setupProfile = async (profileData) => {
    try {
      const res = await fetch('http://localhost:5000/api/user/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || "Failed to complete setup" };
    } catch (error) {
       return { success: false, message: "Network Error: Could not connect to the backend server." };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || "Failed to update profile" };
    } catch (error) {
       return { success: false, message: "Network Error: Could not connect to the backend server." };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('onestop_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setupProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
