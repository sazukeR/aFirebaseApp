import { Grid, Typography } from "@mui/material";
import React from "react";
// CON ESTE COMPONENTE REUTILIZAREMOS LA PANTALLA PARA LOGIN Y REGISTRO
export const AuthLayout = ({ children, title = "" }) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", backgroundColor: "primary.main", padding: 4 }}
    >
      <Grid
        item
        className="box-shadow"
        xs={3}
        sx={{
          backgroundColor: "white",
          padding: 3,
          borderRadius: 2,
          width: { sm: 450 },
        }}
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          {title}
        </Typography>
        {/* aqui van los children */}
        {children}
      </Grid>
    </Grid>
  );
};
