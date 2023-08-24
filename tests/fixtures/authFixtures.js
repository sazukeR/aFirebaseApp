// DEBIDO A QUE EL SLICE REALIZA MUCHAS OPERACIONES QUE MODIFICAN UN ESTADO GLOBAL, ES RECOMENDABLE HACER ESTE ARCHIVO DENTRO DE UNA CARPETA FIXTURES PARA CONTROLAR NUESTRO ESTADO GLOBAL DESDE AQUI, ASI LO TENEMOS CENTRALIZADO EN NUESTRAS PRUEBAS
// EL OBJETIVO DE ESTE ARCHIVO ES QUE TODO ESTE CODIGO NO ESTE DIRECTAMENTE DEFINIDO EN LAS PRUEBAS DIFICULTANDO LA LECTURA DE LA MISMA

export const initialState = {
  status: "checking",
  uid: null,
  email: null,
  displayName: null,
  photoUrl: null,
  errorMessage: null,
};

// VOY A OCUPAR OTRO ESTADO PARA CUANDO ESTEMOS AUTENTICADOS

export const authenticatedState = {
  status: "authenticated",
  uid: "123ABC",
  email: "demo@google.com",
  displayName: "Demo User",
  photoUrl: "https://demo.jpg",
  errorMessage: null,
};

export const notAuthenticatedState = {
  status: "not-authenticated",
  uid: null,
  email: null,
  displayName: null,
  photoUrl: null,
  errorMessage: null,
};

export const demoUser = {
  uid: "ABC123",
  email: "demo@google.com",
  displayName: "Demo User",
  photoUrl: "https://foto.jpg",
};
