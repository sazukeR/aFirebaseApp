import { collection, deleteDoc, doc, setDoc } from "firebase/firestore/lite";
import { firebaseDB } from "../../firebase/config";
import {
  addNewEmptyNote,
  deleteNoteById,
  isSavingNote,
  setActiveNote,
  setNotes,
  setPhotosToActiveNote,
  setSaving,
  updateNote,
} from "./journalSlice";
import { loadNotes } from "../../helpers/loadNotes";
import { fileUpload } from "../../helpers/fileUpload";

export const startNewNote = () => {
  return async (dispacth, getState) => {
    dispacth(isSavingNote());

    const { uid } = getState().auth;

    const newNote = {
      title: "",
      body: "",
      date: new Date().getTime(),
    };

    const newDoc = doc(collection(firebaseDB, `${uid}/journal/notes`));

    await setDoc(newDoc, newNote);

    newNote.id = newDoc.id;

    dispacth(addNewEmptyNote(newNote));
    dispacth(setActiveNote(newNote));
  };
};

export const startLoadingNotes = (state) => {
  return async (dispatch, getState) => {
    const { uid } = getState().auth;

    if (!uid) throw new Error("El UID del usuario no existe");
    const notes = await loadNotes(uid);
    dispatch(setNotes(notes));
  };
};

export const startSaveNote = () => {
  return async (dispacth, getState) => {
    dispacth(setSaving());

    const { uid } = getState().auth;
    const { active: note } = getState().journal;

    const noteToFirestore = { ...note };
    delete noteToFirestore.id;

    const docRef = doc(firebaseDB, `${uid}/journal/notes/${note.id}`);
    await setDoc(docRef, noteToFirestore, { merge: true });

    dispacth(updateNote(note));
  };
};

export const startUploadingFiles = (files = []) => {
  return async (dispacth) => {
    dispacth(setSaving());

    const fileUploadPromises = [];

    for (const file of files) {
      fileUploadPromises.push(fileUpload(file));
    }

    const photosUrls = await Promise.all(fileUploadPromises);

    dispacth(setPhotosToActiveNote(photosUrls));
  };
};

export const startDeletingNote = () => {
  return async (dispacth, getState) => {
    const { uid } = getState().auth;
    const { active: note } = getState().journal;

    const docRef = doc(firebaseDB, `${uid}/journal/notes/${note.id}`);

    await deleteDoc(docRef);

    dispacth(deleteNoteById(note.id));
  };
};
