import {
  loginWithEmailPassword,
  logoutFirebase,
  registerUserWithEmailPassword,
  signInWithGoogle,
} from "../../firebase/providers";
import { clearNotesLogout } from "../journal";
import { checkingCredentials, login, logout } from "./authSlice";

export const checkingAuthentication = (email, password) => {
  return async (dispatch) => {
    dispatch(checkingCredentials());
  };
};

export const startGoogleSignIn = () => {
  return async (dispatch) => {
    dispatch(checkingCredentials());

    const result = await signInWithGoogle();
    // AQUI PODRIAMOS COLOCAR UN CONSOLE.LOG DEL RESULT PARA VER LOS DATOS DEL USER

    if (!result.ok) return dispatch(logout(result.errorMessage));
    dispatch(login(result));
  };
};

// NOS CREAMOS UN NUEVO THUNK PARA EL FIREBASDE

export const startCreatingUserWithEmailPassword = ({
  email,
  password,
  displayName,
}) => {
  return async (dispatch) => {
    dispatch(checkingCredentials());

    // DESESTRUCTURACION DE LO QUE VIENE DE LA RESPUESTA
    const { ok, uid, photoURL, errorMessage } =
      await registerUserWithEmailPassword({
        email,
        password,
        displayName,
      });

    if (!ok) return dispatch(logout({ errorMessage })); // SI ALGO SALE MAL, VOY A MANDAR A LLAMAR EL LOGOUT Y LE VOY A MANDAR EL ERROR MESSAGE COMO PAYLOAD

    dispatch(login({ uid, displayName, email, photoURL }));
  };
};

export const startLoginWithEmailPassword = ({ email, password }) => {
  // se va a despachar el logout o el login

  return async (dispatch) => {
    dispatch(checkingCredentials());
    const result = await loginWithEmailPassword({
      email,
      password,
    });

    if (!result.ok) return dispatch(logout(result));

    dispatch(login(result));
  };
};

export const startLogout = () => {
  return async (dispatch) => {
    await logoutFirebase();
    dispatch(clearNotesLogout());
    dispatch(logout());
  };
};
