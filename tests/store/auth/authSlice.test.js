import {
  authSlice,
  checkingCredentials,
  login,
  logout,
} from "../../../src/store/auth/authSlice";
import {
  authenticatedState,
  demoUser,
  initialState,
} from "../../fixtures/authFixtures";

describe("Pruebas en authSlice.js", () => {
  test('Debe regresar el estado inicial y llamarse "auth"', () => {
    const state = authSlice.reducer(initialState, {});
    // console.log(state);
    expect(authSlice.name).toBe("auth"); // ESTO SERVIRIA PARA ASEGURARSE DE QUE NADIE LE HA CAMBIADO EL NOMBRE EN EL SLICE DEL AUTH
    expect(state).toEqual(initialState); // COMPARAR EL ESTADO INCIAL DEL SLICE CON EL ESTADO INICIAL DEFINIDO TAMBIEN EN EL SLICE
  });

  test("Debe realizar la autenticacion", () => {
    const state = authSlice.reducer(initialState, login(demoUser)); // EL DEMO USER LO TRAEMOS DEL ARCHIVO AUTHFIXTURES, QUE ES UN ARCHIVO QUE HEMOS CREADO PARA ESTAS PRUEBAS

    // console.log(login(demoUser))
    // console.log(state) // AQUI VEREMOS QUE EL USUARIO ESTA AUTENTICADO
    expect(state).toEqual({
      status: "authenticated",
      uid: demoUser.uid,
      email: demoUser.email,
      displayName: demoUser.displayName,
      photoUrl: demoUser.photoUrl,
      errorMessage: null,
    });
  });

  test("Debe realizar el logout (sin argumentos)", () => {
    const state = authSlice.reducer(authenticatedState, logout());

    // console.log(state);

    expect(state).toEqual({
      status: "not-authenticated",
      uid: null,
      email: null,
      displayName: null,
      photoUrl: null,
      errorMessage: undefined,
    });
  });

  test("Debe realizar el logout y mostrar el mensaje de error", () => {
    const errorMessage = {
      errorMessage: "Credenciales no son correctas",
    };

    const state = authSlice.reducer(authenticatedState, logout(errorMessage));

    // console.log(state);

    expect(state).toEqual({
      status: "not-authenticated",
      uid: null,
      email: null,
      displayName: null,
      photoUrl: null,
      errorMessage: "Credenciales no son correctas",
    });
  });

  test("Debe de cambiar el estado a checking", () => {
    const state = authSlice.reducer(authenticatedState, checkingCredentials());
    expect(state.status).toBe("checking");
  });
});
