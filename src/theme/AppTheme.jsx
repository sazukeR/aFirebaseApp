import React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { purpleTheme } from "./purpleTheme";

export const AppTheme = ({ children }) => {
  return (
    <ThemeProvider theme={purpleTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
