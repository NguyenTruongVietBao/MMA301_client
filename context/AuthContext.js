import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://mma301-backend.onrender.com/api";

const AuthContext = createContext({});
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    authenticated: false,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setAuthState({
            user: JSON.parse(userData),
            authenticated: true,
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng:", error);
      }
    };
    loadUser();
  }, []);

  const register = async (username, email, password, phone) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, {
        username,
        email,
        password,
        phone,
      });
      console.log("Register successful:", res.data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });
      if (res.data) {
        const userData = {
          ...res.data,
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token
        };
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        setAuthState({ user: userData, authenticated: true });
        return userData;
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.response?.data || error.message);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    setAuthState((prevState) => ({
      ...prevState,
      user: null,
      authenticated: false,
    }));
    console.log(
      " -------------------------- Logged out -------------------------- "
    );
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
