import { fireEvent, render, screen } from "@testing-library/react";
import { LoginPage } from "../../../src/auth/pages/LoginPage";
import { Provider, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../../src/store/auth";
import { MemoryRouter } from "react-router-dom";
import { notAuthenticatedState } from "../../fixtures/authFixtures";

// NECESITO MOCKEAR EL DISPATCH PARA SOBREESCRIBIR SU COMPORTAMIENTO PARA PODER EVALUAR LOS VALORES QUE LE ESTOY ENVIANDO A LOS THUNKS
// CON EL MOCK SOBREESCRIBIREMOS EL USEDISPATCH, PERO EL USE SELECTOR QUE TAMBIEN VIENE DE ESA LIBRERIA DEBE QUEDAR TAL CUAL COMO ESTA NECESITAMOS QUE SE MANTENGA IGUAL

const mockStartGoogleSignIn = jest.fn();
const mockStartLoginWithEmailPassword = jest.fn();

jest.mock("../../../src/store/auth/thunks", () => ({
  startGoogleSignIn: () => mockStartGoogleSignIn,
  startLoginWithEmailPassword: ({ email, password }) => {
    return () => mockStartLoginWithEmailPassword({ email, password });
  }, // PARA EL MOCK DE LA FUNCION STARTLOGINWITHEMAILPASSWORD NECESITAMOS TAMBIEN PASAR ARGUMENTOS
})); // HACEMOS MOCK DE LA FUNCION QUE QUEREMOS VER SI HA SIDO LLAMADA

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"), // NECESITAMOS MANTENER EL USESELECTOR TAL CUAL COMO ESTA PARA EVITAR ERRORES, PERO AL MISMO TIEMPO NECESITAMOS MOCKEAR EL USEDISPATCH QUE ESTA DENTRO DEL MISMO PACK DE REACT-REDUX
  useDispatch: () => (fn) => fn(), // CUANDO SE LLAME EL USEDISPATCH VA A REGRESAR ESA FUNCION
}));

// CUANDO ESTAMOS TRABAJANDO CON REDUX EL COMPONENTE ESTA BUSCANDO EN EL ARBOL DE COMPONENTES EL STORE, PERO COMO NO EXISTE ARROJA ERROR
// DE ALGUNA FORMA TENEMOS QUE PROVEER ESE STORE
// DEBEMOS PROPOSIONAR EL STORE PARA QUE EL COMPONENTE PUEDA HACER USO DE ESOS RECURSOS
// TENGO QUE PROPORSIONAR LOS REDUCER QUE TIENEN INTERACCION CON EL COMPONENTE QUE QUIERO RENDERIZAR
// EL PRELOADER STATE ME SIRVE PARA PRECARGAR CIERTO ESTADO EN EL STORE
// NUESTRO COMPONENTE ESTA ENVUELTO EN UN ROUTER ASI QUE PARA NUESTRA PRUEBA DEBEMOS USAR EL MEMORYROUTER
// RECORDEMOS QUE CON SCREEN.DEBUG() PODEMOS VER COMO SE ESTA RENDERIZANDO NUESTRO COMPONENTE EN LA PRUEBA

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  preloadedState: {
    auth: notAuthenticatedState, // CON ESTO PODEMOS SIMULAR UN ESTADO INICIAL PARA NUESTRO COMPONENTE DE PRUEBAS, LO NECESITAMOS PORQUE AL HACER CLICK EN EL BOTON DE GOOGLE, EL ESTADO DE LA AUTENTICACION DEBE SER NO AUTENTICADO, SI ESTUVIERA EN CHECKING EL BOTON ESTARIA DESHABILITADO AL MOMENTO DE REALIZAR LA PRUEBA Y NO PODRIAMOS HACER CLICK EN EL CON EL FIREEVENT
  },
});

describe("Pruebas en el LoginPage.jsx", () => {
  beforeEach(() => jest.clearAllMocks()); // ES MUY IMPORTANTE COLOCAR ESTO PARA EVITAR TENER CONFUCIONES ENTRE LOS MOCKS DE LAS DIFERENTES PRUEBAS

  test("Debe renderizarse correctamente", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    //  screen.debug();

    expect(screen.getAllByText("Login").length).toBeGreaterThanOrEqual(1); // TIENE QUE EXISTIR POR LO MENOS UNA VEZ
  });

  // EN LA SIG PRUEBA NOS ASEGURAREMOS DE QUE CUANDO SE REALIZA LA AUTENTICACION CON GOOGLE SE CONCRETE EL PROCEDIMIENTO QUE SE ESPERA

  test("Boton de google debe llamar el startGoogleSignin", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    // DEBEMOS ESTABLECER EL NOT-AUTHENTICATED COMO ESTADO, PARA CUANDO ESTOY EN EL LOGIN, NUESTRO BOTON LUZCA HABILITADO Y PODER HACER CLICK SOBRE EL

    //console.log(store.getState()); //CON ESTOS CONSOLE.LOG PODEMOS ANALIZAR EL ESTADO DE NUESTRA AUTENTICACION ANTES Y DESPUES DE HACER CLICK EN EL BOTON
    const googleBtn = screen.getByLabelText("google-btn");
    //console.log(googleBtn);
    fireEvent.click(googleBtn); // EN ESTE MOMENTO EL BOTON ESTA DESHABILITADO, POR ESO NECESITO USAR EL PRELOADEDSTATE PARA QUE EL ESTADO LUZCA COMO ESPERO EN ESTE MOMENTO
    //console.log(store.getState()); // ANALIZAMOS COMO QUEDA NUESTRO ESTADO LUEGO DE HACER CLICK EN EL BOTON

    // PARA ANALIZAR SI LA FUNCION QUE REALIZA LA AUTENTICACION CON GOOGLE HA SIDO LLAMADA NECESITAMOS REALIZAR LOS MOCKS RESPECTIVOS DE DISPATCH , LA FUNCION STARGOOGLESIGNIN Y LOS THUNKS

    expect(mockStartGoogleSignIn).toHaveBeenCalled();
  });

  test("submit debe llamar el startLoginWithWEmailPassword", () => {
    const email = "reinaldojcg@hotmail.com";
    const password = "123456";

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    // ASI TOMAMOS ELEMENTOS DE MATERIAL

    const emailField = screen.getByRole("textbox", { name: "Correo" });

    fireEvent.change(emailField, { target: { name: "email", value: email } });
    // PARA TOMAR EL INPUT DEL PASSWORD ES DIFERENTE, NECESITAMOS USAR EL INPUTPROPS DENTRO DEL COMPONENTE Y POSTERIORMENTE TOMARLO
    const passwordField = screen.getByTestId("password");
    fireEvent.change(passwordField, {
      target: { name: "password", value: password },
    });

    const loginForm = screen.getByLabelText("form");
    fireEvent.submit(loginForm);

    expect(mockStartLoginWithEmailPassword).toHaveBeenCalledWith({
      email: email,
      password: password,
    });
  });
});
