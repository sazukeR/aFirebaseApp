import { Navigate, Route, Routes } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { JournalRoutes } from "../journal/routes/JournalRoutes";

import { CheckingAuth } from "../ui";
import { useCheckAuth } from "../hooks/useCheckAuth";

export const AppRouter = () => {
  const status = useCheckAuth();

  if (status === "checking") {
    return <CheckingAuth />;
  }

  return (
    <Routes>
      {/* CUANDO TERMINO DE REALIZAR LA AUTENTICACION SE SIGUE MOSTRANDO EL LOGIN, Y NO DEBERIA YA QUE ESTAMOS AUTHENTICADOS */}
      {/*     ESTO ES COMO DEFINIR RUTAS PRIVADAS Y PUBLICAS PORQUE EL LOGIN SOLO ME VA A APARECER SI NO ESTOY AUTENTICADO, EN CAMBIO, SI ESTOY AUTENTICADO ME APARECE LA PAGINA COMO TAL */}
      {status === "authenticated" ? (
        <Route path="/*" element={<JournalRoutes />} />
      ) : (
        <Route path="/auth/*" element={<AuthRoutes />} />
      )}

      <Route path="/*" element={<Navigate to="/auth/login" />} />

      {/* Login y Registro */}
      {/*       <Route path="/auth/*" element={<AuthRoutes />} /> */}

      {/* JournalApp */}
      {/*    <Route path="/*" element={<JournalRoutes />} /> */}
    </Routes>
  );
};
