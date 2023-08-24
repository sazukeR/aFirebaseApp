// EN ESTE ARCHIVO ESTARAN LOS PROVEEDORES DE AUTENTICACION
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth } from "./config";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    // const credentials = GoogleAuthProvider.credentialFromResult(result); // con esto podemos ver las credenciales
    const { displayName, email, photoURL, uid } = result.user;
    return {
      ok: true,
      // user info
      displayName,
      email,
      photoURL,
      uid,
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    return {
      ok: false,
      errorMessage,
    };
  }
};

export const registerUserWithEmailPassword = async ({
  email,
  password,
  displayName,
}) => {
  try {
    // OCUPAMOS LLEGAR A FIREBASE
    console.log({ email, password, displayName });

    const resp = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const { uid, photoURL } = resp.user;

    //console.log(resp);

    // TODO: actualizar el displayName en firebase

    await updateProfile(firebaseAuth.currentUser, { displayName }); // CUANDO REGISTRO ESTO AUTOMATICAMENTE LOGUEA

    return {
      ok: true,
      uid,
      photoURL,
      email,
      displayName,
    };
  } catch (error) {
    console.log(error.message, "jajajaajaj");
    return { ok: false, errorMessage: error.message };
  }
};

export const loginWithEmailPassword = async ({ email, password }) => {
  // signInWithEmailAndPassword

  try {
    const resp = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const { uid, photoURL, displayName } = resp.user;

    return {
      ok: true,
      uid,
      photoURL,
      email,
      displayName,
    };
  } catch (error) {
    return { ok: false, errorMessage: error.message };
  }
};

export const logoutFirebase = async () => {
  return await firebaseAuth.signOut();
};
