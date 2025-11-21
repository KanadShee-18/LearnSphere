import { useState, useEffect } from "react";
import axiosInstance, {
  setCurrentToken,
  setTokenUpdateCallback,
} from "../services/axios-instance";
import { saveAccessToken } from "../utils/tokenStore";
import { FaSpinner } from "react-icons/fa6";
import { useToken } from "../context/TokenContext";

export default function AuthProvider({ children }) {
  const { updateToken, clearToken } = useToken();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setTokenUpdateCallback(updateToken);
  }, [updateToken]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await axiosInstance.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;
        setCurrentToken(newToken);
        updateToken(newToken);

        console.log("Refresh token in provider: ", newToken);
        saveAccessToken(newToken);
        console.log("Auth initialized with refreshed token!");
      } catch (err) {
        console.log("Auth initialization failed while refreshing token!");
        saveAccessToken(null);
        clearToken();
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, [updateToken, clearToken]);

  if (initializing) {
    console.log("Initializing application...");
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        <FaSpinner className='animate-spin' />
      </div>
    );
  }

  return children;
}
