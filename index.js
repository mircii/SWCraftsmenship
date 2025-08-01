const express = require('express');
const updateBook = require('./putMethod');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const PORT = 3000;
const app = express();

app.use(express.json());

const books = [];

const findBookById = (id) => {
    return books.find(book => book.id == id);
};

const generateBookId = () => {
    return Math.floor(Math.random() * 10000);
};

const validateBookInput = (title, author) => {
    return title && author;
};

const createBook = (title, author) => {
    return {
        id: generateBookId(),
        title: title,
        author: author
    };
};

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: List of books
 */
app.get('/books', (req, res) => {
    res.json(books);
});

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get book by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to retrieve
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 */
app.get('/books/:id', (req, res) => {
    const book = findBookById(req.params.id);
    
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

/**
 * @openapi
 * /books:
 *   post:
 *     summary: Create a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Great Gatsby"
 *               author:
 *                 type: string
 *                 example: "F. Scott Fitzgerald"
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Missing fields
 */
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  
  if (!validateBookInput(title, author)) {
    return res.status(400).json({ error: 'Missing required fields: title and author' });
  }
  
  const book = createBook(title, author);
  books.push(book);
  
  res.status(201).json(book);
});

app.put('/books/:id', updateBook(books, validateBookInput));

app.head('/books/:id', (req, res) => {
    const book = findBookById(req.params.id);
    if(book){
        res.sendStatus(200);
    }else{
        res.sendStatus(404);
    }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});
