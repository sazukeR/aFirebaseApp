import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSaving: false,
  messageSaved: "",
  notes: [],
  active: null,
  /*  active: {
    id: "ABC123",
    title: "",
    body: "",
    date: 1234567,
    imageUrls: [], // https://foto1.jpg
  }, */
};

export const journalSlice = createSlice({
  name: "journal",

  initialState,

  reducers: {
    isSavingNote: (state) => {
      state.isSaving = true;
    },

    addNewEmptyNote: (state, action) => {
      state.notes.push(action.payload);
      state.isSaving = false;
    },

    setActiveNote: (state, action) => {
      state.active = action.payload;
      state.messageSaved = "";
    },

    setNotes: (state, action) => {
      state.notes = action.payload;
    },

    setSaving: (state) => {
      state.isSaving = true;
      state.messageSaved = "";
    },

    updateNote: (state, action) => {
      state.isSaving = false;
      state.notes = state.notes.map((note) => {
        if (note.id == action.payload.id) return action.payload;
        return note;
      });

      state.messageSaved = `${action.payload.title}, actualizada correctamente`;
    },

    clearNotesLogout: (state) => {
      state.isSaving = false;
      state.messageSaved = "";
      state.notes = [];
      state.active = null;
    },

    deleteNoteById: (state, action) => {
      state.active = null;
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },

    setPhotosToActiveNote: (state, action) => {
      state.active.imageUrls = [...state.active.imageUrls, ...action.payload];
      state.isSaving = false;
    },
  },
});

export const {
  isSavingNote,
  addNewEmptyNote,
  setActiveNote,
  setNotes,
  setSaving,
  updateNote,
  deleteNoteById,
  setPhotosToActiveNote,
  clearNotesLogout,
} = journalSlice.actions;
