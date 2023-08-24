module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFiles: ["./jest.setup.js"],
  transformIgnorePatterns: [], // ESTA PARTE FUE INCLUIDA PARA REALIZAR LAS PRUEBAS EN THUNKS, SIENDO IGNORADOS POR LA PARTE DE JEST
};
