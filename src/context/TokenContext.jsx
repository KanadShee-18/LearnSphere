import { createContext, useContext, useState, useCallback } from "react";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const updateToken = useCallback((newToken) => {
    setToken(newToken);
  }, []);

  const clearToken = useCallback(() => {
    setToken(null);
  }, []);

  return (
    <TokenContext.Provider value={{ token, updateToken, clearToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};
