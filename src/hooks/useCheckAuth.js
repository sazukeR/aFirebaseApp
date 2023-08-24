import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/auth";
import { firebaseAuth } from "../firebase/config";
import { startLoadingNotes } from "../store/journal";

export const useCheckAuth = () => {
  const { status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // FIREBASE NOS OFRECE UNA FORMA DE MONITOREAR LOS CAMBIOS QUE UN USUARIO VA A TENER
    // CUANDO EL ESTADO DE LA AUTENTICACION CAMBIA... ONAUTHSTATECHANGED

    onAuthStateChanged(firebaseAuth, async (user) => {
      // console.log(user);

      if (!user) return dispatch(logout());
      const { uid, email, displayName, photoURL } = user;
      dispatch(login({ uid, email, displayName, photoURL }));
      dispatch(startLoadingNotes());
    });
  }, []);

  return status;
};
