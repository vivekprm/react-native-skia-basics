import React, { useContext, createContext } from "react";

export const ThemeContext = createContext(null);
export const ThemeProvider = ({
  primary,
  children,
}) => (
  <ThemeContext.Provider value={{ primary }}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (theme === null) {
    throw new Error("Theme provider not found");
  }
  return theme;
};