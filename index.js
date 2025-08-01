const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const createBookRoutes = require('./routes/bookRoutes');

const PORT = 3000;
const app = express();

app.use(express.json());

const books = [];

app.use('/books', createBookRoutes(books));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});