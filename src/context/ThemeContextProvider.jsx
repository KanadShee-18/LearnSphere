import React, { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../slices/themeSlice";
export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "light") {
      dispatch(setTheme("dark"));
    } else {
      dispatch(setTheme("light"));
    }
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
