import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = "http://localhost:3000/api/auth";

  useEffect(() => {
    const checkUserStatus = () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedUser = jwtDecode(token);
          
          const isExpired = decodedUser.exp * 1000 < Date.now();
          if (isExpired) {
            logout(); // Xóa token hết hạn
            return;
          }

          // 2. Cập nhật state
          setUser(decodedUser);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Token lỗi hoặc không hợp lệ:", err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decodedUser = jwtDecode(token);
      console.log("Token đã giải mã:", decodedUser);
      setUser(decodedUser);
      setIsLoggedIn(true);
      alert("Đăng nhập thành công!");
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Đăng nhập thất bại!";
      alert(message);
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };


  const register = async (email, password, name) => {
    try {
      const res = await axios.post(`${API_URL}/register`, {
        email,
        password,
        name,
      });

      alert(res.data.message || "Đăng ký thành công! Vui lòng đăng nhập.");
      return true; 

    } catch (err) {
      const message = err.response?.data?.message || "Đăng ký thất bại!";
      alert(message);
      console.error(err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


