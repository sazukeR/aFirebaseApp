// import { signInWithGoogle } from "../../../src/firebase/providers"; // ESTO FUE IMPORTADO PARA COPIAR LA RUTA DEL MOCK QUE UTILIZAMOS
import {
  loginWithEmailPassword,
  logoutFirebase,
  signInWithGoogle,
} from "../../../src/firebase/providers";
import {
  checkingCredentials,
  login,
  logout,
} from "../../../src/store/auth/authSlice";
import {
  checkingAuthentication,
  startGoogleSignIn,
  startLoginWithEmailPassword,
  startLogout,
} from "../../../src/store/auth/thunks";
import { clearNotesLogout } from "../../../src/store/journal";
import { demoUser } from "../../fixtures/authFixtures";

// PARA REALIZAR ESTA PRUEBA HAREMOS UN MOCK DEL DISPATCH Y ASEGURARNOS DE QUE LAS FUNCIONES SEAN INVOCADAS
// ESTAS FUNCIONES LLEGAN A FIREBASE, ES NECESARIO UN MOCK
// EN ESTE PUNTO REQUERIMOS COLOCAR UNA LINEA DE CONFIGURACION EN EL ARCHIVO jest.config.cjs ESTO NOS PERMITIRA IGNORAR CIERTAS FUNCIONES EN FIREBASE, TAMBIEN SERIA CONVENIENTE UTILIZAR SIEMPRE ESTAS CONFIGURACIONES
// NUESTROS THUNKS SON FUNCIONES QUE REGRESAN UNA FUNCION ASINCRONA, (UN CALLBACK)
jest.mock("../../../src/firebase/providers");

describe("Pruebas en thunks (thunks del auth)", () => {
  const dispatch = jest.fn(); // COMO UTILIZAREMOS ESTE DISPATCH EN VARIAS PRUEBAS LO COLOCAMOS ACA, A UN NIVEL SUPERIOR PARA PODER USARLO EN TODOS LOS TEST

  beforeEach(() => jest.clearAllMocks());

  test("El checkingAuthentication Debe invocar el checkingCredentials()", async () => {
    //checkingAuthentication();
    // const valor = checkingCredentials() // ESTE ES EL PRODUCTO QUE NECESITAMOS PARA EJECUTAR LA PRUEBA DEL DISPATCH
    //console.log(valor)

    // PRIMERO EL LLAMADO DE LA FUNCION Y SEGUNDO EL VALOR DE RETORNO DE LA FUNCION

    await checkingAuthentication()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(checkingCredentials()); // AQUI EVALUAMOS QUE EL CHECKINGAUTHENTICATION HAYA SIDO LLAMADO CON EL PRODUCTO DE LA FUNCION CHECKINGCREDENTIALS
  });

  test("startGoogleSignIn Debe llamar checkingCredentials() y login (caso de exito)", async () => {
    // LA FUNCION SINGINWITHGOOGLE ABRE UN POPUP ENTONCES LO MEJOR SERA CREAR UN MOCK, DE HECHO YA TENEMOS UN MOCK COMPLETO DE TODOS LOS PROVIDERS

    const loginData = { ok: true, ...demoUser }; // ASI PODEMOS COLOCAR TODAS SUS PROPIEDADES

    await signInWithGoogle.mockResolvedValue(loginData); // ESTA FUNCION COMO TAL YA ES UN MOCK, ARRIBA COLOCAMOS TODOS LOS PROVIDERS COMO MOCK

    await startGoogleSignIn()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
    expect(dispatch).toHaveBeenCalledWith(login(loginData));
  });

  test("startGoogleSignIn Debe llamar checkingCredentials() y logout (caso de error)", async () => {
    // LA FUNCION SINGINWITHGOOGLE ABRE UN POPUP ENTONCES LO MEJOR SERA CREAR UN MOCK, DE HECHO YA TENEMOS UN MOCK COMPLETO DE TODOS LOS PROVIDERS

    const loginData = { ok: false, errorMessage: "Un error en Google" }; // ASI PODEMOS COLOCAR TODAS SUS PROPIEDADES

    await signInWithGoogle.mockResolvedValue(loginData); // ESTA FUNCION COMO TAL YA ES UN MOCK, ARRIBA COLOCAMOS TODOS LOS PROVIDERS COMO MOCK

    await startGoogleSignIn()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
    expect(dispatch).toHaveBeenCalledWith(logout(loginData.errorMessage));
  });

  test("startLoginWithEmailPassword debe llamar checkingCredentials y login (caso de exito)", async () => {
    const loginData = {
      ok: true,
      ...demoUser,
    };

    const formData = {
      email: demoUser.email,
      password: "123456",
    };

    await loginWithEmailPassword.mockResolvedValue(loginData);

    await startLoginWithEmailPassword(formData)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());

    expect(dispatch).toHaveBeenCalledWith(login(loginData));
  });

  /* test("startLoginWithEmailPassword debe llamar checkingCredentials y login (caso de error)", async () => {});
  test("startCreatingUserWithEmailPassword debe llamar checkingCredentials y registerUserWithEmailPassword (caso exito)", async () => {});
  test("startCreatingUserWithEmailPassword debe llamar checkingCredentials y registerUserWithEmailPassword (caso error)", async () => {}); */

  test("startLogout debe llamar logoutFirebase, clearNotes y logout", async () => {
    await startLogout()(dispatch);

    expect(logoutFirebase).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(clearNotesLogout());
    expect(dispatch).toHaveBeenCalledWith(logout());
  });
});
