import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "checking", //"checking" 'not-authenticated', 'authenticated'
  uid: null,
  email: null,
  displayName: null,
  photoUrl: null,
  errorMessage: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.status = "authenticated"; //"checking" 'not-authenticated', 'authenticated'
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = payload.displayName;
      state.photoUrl = payload.photoUrl;
      state.errorMessage = null;
    },
    // EN EL LOGOUT LO QUE HARIA ES COLOCAR COMO SE ENCUENTRA EL ESTADO DE MI SESION ACTUALMENTE
    logout: (state, { payload }) => {
      state.status = "not-authenticated"; //"checking" 'not-authenticated', 'authenticated'
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.photoUrl = null;
      state.errorMessage = payload?.errorMessage; // SE LE PUSO UN SIGNO DE INTERROGACION PARA VER SI VIENE EL ERROR MESSAGE
    },
    checkingCredentials: (state) => {
      state.status = "checking";
    },
  },
});

export const { login, logout, checkingCredentials } = authSlice.actions;
