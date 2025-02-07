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
        console.log("User data:", authState.user);
        console.log("authenticated", authState.authenticated);
      } catch {
        console.log("User not logged in");
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
        await AsyncStorage.setItem("user", JSON.stringify(res.data));
        setAuthState({ user: res.data, authenticated: true });
        return res.data;
      }
    } catch (error) {
      console.error(error);
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
