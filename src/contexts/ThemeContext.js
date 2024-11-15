// utils/ThemeContext.js

import React, { createContext, useState, useEffect } from "react";
import { Appearance } from "react-native";

export const ThemeContext = createContext();

export const lightTheme = {
  background: "black",
  text: "white",
  inputBackground: "#f0f0f0",
  buttonBackground: "#6200ee",
  buttonText: "#ffffff",
  placeholderText: "#a0a0a0",
  borderColor: "black",
};

export const darkTheme = {
  background: "#121212",
  text: "#ffffff",
  inputBackground: "#2c2c2c",
  buttonBackground: "#bb86fc",
  buttonText: "#000000",
  placeholderText: "#757575",
  borderColor: "black",
};

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(
    colorScheme === "dark" ? darkTheme : lightTheme
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
