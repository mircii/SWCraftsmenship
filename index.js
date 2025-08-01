require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const bookRoutes = require('./routes/bookRoutes');
const echoRoutes = require('./routes/echoRoutes');

const PORT = 3000;
const app = express();

const mongoose = require('mongoose');

const Book = require('./models/Book');

// MongoDB Atlas connection string
const MONGODB_URI = process.env.ConnectionString;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB!');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(express.json());

app.use('/books', bookRoutes);
app.use('/echo', echoRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});