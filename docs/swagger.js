const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Books API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

module.exports = swaggerJsdoc(options);