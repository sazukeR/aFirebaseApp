import { collection, deleteDoc, getDocs } from "firebase/firestore/lite";
import { firebaseDB } from "../../../src/firebase/config";
import {
  addNewEmptyNote,
  isSavingNote,
  setActiveNote,
} from "../../../src/store/journal/journalSlice";
import { startNewNote } from "../../../src/store/journal/thunks";

describe("Pruebas en thunks (journal)", () => {
  // OCUPAMOS UN MOCK DEL DISPATCH

  const dispatch = jest.fn();
  const getState = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  test("startNewNote debe crear una nueva nota en blanco", async () => {
    // EN ESTA PRUEBA NOS PIDEN PERMISOS DE FIREBASE Y ES LOGICO PORQUE NOSOTROS CON ESTA FUNCION BUSCAMOS GUARDAR INFORMACION EN FIREBASE

    // LO MAS RECOMENDABLE SERIA CONFIGURAR UNA NUEVA INSTANCIA DE FIREBASE SOLO PARA HACER EL TESTING, CREAREMOS UN NUEVO PROYECTO EN EL DASHBOARD DE FIREBASE ESCLUSIVO PARA LAS PRUEBAS

    const uid = "TEST-UID";

    getState.mockReturnValue({ auth: { uid: uid } }); // EL GETSTATE ES LA FUNCION DONDE TENGO TODOS LOS VALORES DE MI STORE, PARA USARLO EN LAS PRUEBAS PODEMOS CREAR UN MOCK Y UTILIZAR MOCKRETURN VALUE PARA SIMULAR LO QUE NECESITAMOS DE ESTA FUNCION

    await startNewNote()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(isSavingNote());
    expect(dispatch).toHaveBeenCalledWith(
      addNewEmptyNote({
        body: "",
        title: "",
        id: expect.any(String), // SABEMOS QUE ESPERAMOS ESTOS DATOS, PERO NO SABEMOS EL ID DEL USUARIO, NI LA FECHA EN ESE MOMENTO, PARA EVITAR ESTO COLOCAMOS .ANY PARA SABER QUE ESTAMOS ESPERANDO UN ID
        date: expect.any(Number), // ANY NUMBER PARA SABER QUE ESTAMOS ESPERANDO UN NUMERO (NO PODEMOS SABER LA FECHA PRECISA DE LA PRUEBA)
      })
    );
    expect(dispatch).toHaveBeenCalledWith(
      setActiveNote({
        body: "",
        title: "",
        id: expect.any(String), // SABEMOS QUE ESPERAMOS ESTOS DATOS, PERO NO SABEMOS EL ID DEL USUARIO, NI LA FECHA EN ESE MOMENTO, PARA EVITAR ESTO COLOCAMOS .ANY PARA SABER QUE ESTAMOS ESPERANDO UN ID
        date: expect.any(Number), // ANY NUMBER PARA SABER QUE ESTAMOS ESPERANDO UN NUMERO (NO PODEMOS SABER LA FECHA PRECISA DE LA PRUEBA)
      })
    );

    // COMO ESTAMOS REALIZANDO INSERCIONES EN FIREBASE, DEBEMOS BORRAR ESTAS INSERCIONES PARA NO LLENAR LA MEMORIA, POR ESO REALIZAMOS ESTA BASE DE DATOS EXCLUSIVA PARA LAS PRUEBAS

    const collectionRef = collection(firebaseDB, `${uid}/journal/notes`);

    const docs = await getDocs(collectionRef);

    // console.log(docs); // AQUI VEREMOS TODOS LOS DATOS QUE HEMOS CREADO EN LA BASE DE DATOS CUANDO ESTAMOS HACIENDO LAS PRUEBAS

    const deletePromises = [];

    docs.forEach((doc) => deletePromises.push(deleteDoc(doc.ref)));

    await Promise.all(deletePromises);
  });
});
