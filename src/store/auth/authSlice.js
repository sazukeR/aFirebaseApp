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

    logout: (state, { payload }) => {
      state.status = "not-authenticated"; //"checking" 'not-authenticated', 'authenticated'
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.photoUrl = null;
      state.errorMessage = payload?.errorMessage;
    },
    checkingCredentials: (state) => {
      state.status = "checking";
    },
  },
});

export const { login, logout, checkingCredentials } = authSlice.actions;
