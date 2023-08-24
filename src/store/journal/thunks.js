//  TENGO QUE PENSAR EN EL TIPO DE ACCIONES QUE VOY A DESPACHAR
// CUANDO SE QUE LA ACCION QUE QUIERO DESPACHAR ES ASINCRONA, DEBO PONERLA EN LOS THUNKS

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

// CON EL GETSTATE PUEDO TOMAR TODO LO QUE ESTA EN MI ESTADO, TODO LO QUE TENGO EN EL STORE
export const startNewNote = () => {
  return async (dispacth, getState) => {
    // necesitamos el uid del usuario para grabar en firebase

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
    // dispatch(newNote)
    // dispatch(activarNote)
  };
};

export const startLoadingNotes = (state) => {
  return async (dispatch, getState) => {
    const { uid } = getState().auth;

    if (!uid) throw new Error("El UID del usuario no existe"); // NUNCA DEBERIAMOS VER ESTE ERROR, SE SUPONE QUE ESTAMOS AUTENTICADOS PARA PODER VER ESTA PANTALLA
    const notes = await loadNotes(uid);
    dispatch(setNotes(notes));
  };
};

export const startSaveNote = () => {
  return async (dispacth, getState) => {
    dispacth(setSaving());

    const { uid } = getState().auth;
    const { active: note } = getState().journal;

    const noteToFirestore = { ...note }; // EXPARCIMOS LA NOTA ACTIVA
    delete noteToFirestore.id; // REALIZAMOS ESTA OPERACION PARA ELIMINAR EL ID DE LA NOTA ACTUALIZADA, YA QUE UTILIZAREMOS EL ID DE LA NOTA ACTIVA, (ESTO PARA EVITAR ACTUALIZAR EL ID DE LA NOTA, NO NECESITAMOS ACTUALIZAR EL ID, SOLO SU CUERPO Y TITULO)

    const docRef = doc(firebaseDB, `${uid}/journal/notes/${note.id}`);
    await setDoc(docRef, noteToFirestore, { merge: true }); // CON EL MERGE EN TRUE SI HAY CAMPOS QUE ESTAN AQUI QUE NO ESTAN EN LA BD SE SOBREESCRIBEN

    dispacth(updateNote(note));
  };
};

export const startUploadingFiles = (files = []) => {
  return async (dispacth) => {
    dispacth(setSaving());

    // await fileUpload(files[0]);

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

    // console.log({ uid, note });

    const docRef = doc(firebaseDB, `${uid}/journal/notes/${note.id}`);

    await deleteDoc(docRef);

    // UNA VEZ LA BORRAMOS LA NOTA DE FIREBASE, TAMBIEN DEBEMOS BORRARLA DEL STORE

    dispacth(deleteNoteById(note.id));
  };
};
