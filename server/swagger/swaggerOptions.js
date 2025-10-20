const getSwaggerOptions = (port) => ({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quick Show API Documentation",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./swagger/*.js"],
});

export default getSwaggerOptions;
