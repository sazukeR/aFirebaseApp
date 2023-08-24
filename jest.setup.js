// En caso de necesitar la implementación del FetchAPI
import "whatwg-fetch"; // <-- yarn add whatwg-fetch

import "setimmediate"; // OCUPAMOS ESTA IMPORTACION PARA REALIZAR LA PRUEBA DE CLUDINARY QUE ESTA EN EL ARCHIVO fileUpload.test.js

// CONFIGURACION REFERENTE A LAS PRUEBAS PARA EL TESTING
// EN AMBIENTE DE TESTING NECESITAREMOS DEFINIR ESTA RUTA

require("dotenv").config({
  path: ".env.test",
});

jest.mock("./src/helpers/getEnvironments", () => ({
  getEnvironments: () => ({ ...process.env }),
}));
