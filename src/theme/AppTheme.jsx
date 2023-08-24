import React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { purpleTheme } from "./purpleTheme";

/* BASICAMENTE ASI FUNCIONAN ESTOS PROVIDERS, NO SON
MAS QUE COMPONENTES QUE PROVEERAN LA INFORMACION A SUS
COMPONENTES HIJOS   */
// CHILDREN ES UNA PROPERTY QUE VAN A RECIBIR
export const AppTheme = ({ children }) => {
  return (
    <ThemeProvider theme={purpleTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
