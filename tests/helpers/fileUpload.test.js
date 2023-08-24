import { fileUpload } from "../../src/helpers/fileUpload";
import { v2 as cloudinary } from "cloudinary";

// DEBIDO A LOS CAMBIOS DE CLOUDINARY CON JEST, HAY UN PACKETE QUE NO PUEDE ENCONTRAR ( setimmediate ) PARA RESOLVER ESTE PROBLEMA LO QUE HAREMOS ES INSTALAR ESE PACKETE MANUAMENTE ( yarn add -D setimmediate )
// UNA VEZ TERMINA LA INSTALACION NOS VAMOS A LA PARTE DE jest.setup.js
cloudinary.config({
  cloud_name: "dxfakk0wq",
  api_key: "389454698879675",
  api_secret: "IdOhQnBZKsBq3LO6sLYbtJKGBac",
  secure: true,
});

// AL REALIZAR UNA PRUEBA SOBRE EL fileUpload SE TERMINA CREANDO ESTE RECURSO EN EL DASHBOARD DE CLOUDINARY, ES DECIR
// CADA VEZ QUE LA PRUEBA SEA EJECUTADA ESTE RECURSO SERA CREADO,
// OCUPAMOS REALIZAR CIERTAS CONFIGURACIONES PARA PODER ELIMINAR ESE
// RECURSO UNA VEZ QUE HEMOS CONCLUIDO CON LA PRUEBA
// REQUERIREMOS LA KEY EN ESTE PUNTO PERO NO HAY PROBLEMA YA QUE ESTAS
// PRUEBAS SE EJECUTAN EN UN ENTORNO DE BACKEND ( ES DECIR, UN USUARIO COMUN NO TENDRA ACCESO A ELLAS )

// BUSCAREMOS UNA IMAGEN EN INTERNET PARA HACER ESTA PRUEBA, QUE NO SEA UNA IMAGEN TAAN GRANDE, SOLO NOS SERVIRA PARA REALIZAR ESTA PRUEBA

describe("Pruebas en fileUpload.js", () => {
  test("Debe subir el archivo correctamente a cloudinary", async () => {
    const imageUrl =
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&ixid=MnwxMjA3fD88MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80"; // PUEDE QUE ESTA IMAGEN EL DIA DE MANANA NO FUNCIONE // FUE DIFICIL ENCONTRARR UNA URL QUE SIRVA PARA ESTE TEST

    const resp = await fetch(imageUrl);
    const blob = await resp.blob();
    const file = new File([blob], "foto.jpg");

    const url = await fileUpload(file);

    expect(typeof url).toBe("string");

    // console.log(url);
    //   PROCESO PARA ELIMINAR LA IMAGEN DE CLOUDINARY LUEGO DE TERMINAR LA PRUEBA //
    const segments = url.split("/");

    const imageId = segments[segments.length - 1].replace(".jpg", "");

    const cloudResp = await cloudinary.api.delete_resources(
      ["journalApp/" + imageId],
      { resource_type: "image" }
    );
    //console.log({ cloudResp });
  });

  test("Debe retornar null", async () => {
    // ESTO DISPARARA EL ERROR DE NUESTRO CATCH
    const file = new File([], "foto.jpg");
    const url = await fileUpload(file);
    expect(url).toBe(null);
  });
});
