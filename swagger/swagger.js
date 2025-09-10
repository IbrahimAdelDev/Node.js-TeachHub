const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger/swagger.yaml");


// const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerDocument };
