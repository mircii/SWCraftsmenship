const express = require('express');
const updateBook = require('./putMethod');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const { body, validationResult } = require('express-validator');

// Configuration
const PORT = 3000;
const app = express();

app.use(express.json());

const books = [];

const findBookById = (id) => {
  console.log(`Searching for book with ID: ${id}`);
  return books.find(book => book.id == id);
};

const generateBookId = () => {
  const id = Math.floor(Math.random() * 10000);
  console.log(`Generated book ID: ${id}`);
  return id;
};

const validateBookInput = (title, author) => {
  console.log(`Validating book input: title="${title}", author="${author}"`);
  return (
    typeof title === 'string' &&
    typeof author === 'string' &&
    title.trim().length > 0 &&
    author.trim().length > 0
  );
};


const createBook = (title, author) => {
    console.log(`Creating book with title="${title}" and author="${author}"`);
    return {
        id: generateBookId(),
        title: title,
        author: author
    };
};

const getBooksFromDB = () => {
    console.log('Simulating DB call...');
    throw new Error('No database connection available');
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
    console.log('GET /books called');
    try {
        res.json(books);
    } catch (error) {
    console.error('Unexpected error in GET /books:', error.message);
    res.status(500).json({ error: 'Internal server error' });
    }
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
    console.log(`GET /books/${req.params.id} called`);
    try {
        const book = findBookById(req.params.id);
        if (book) {
        console.log(`Book found:`, book);
        res.json(book);
        } else {
        console.warn('Book not found');
        res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        console.error('Unexpected error in GET /books/:id:', error.message);
        res.status(500).json({ error: 'Internal server error' });
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
 *               author:
 *                 type: string 
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Missing fields
 */
app.post('/books', 
  
    [
        body('title')
            .exists({ checkNull: true }).withMessage('Title is required')
            .isString().withMessage('Title must be a string')
            .trim()
            .notEmpty().withMessage('Title cannot be empty'),
        body('author')
            .exists({ checkNull: true }).withMessage('Author is required')
            .isString().withMessage('Author must be a string')
            .trim()
            .notEmpty().withMessage('Author cannot be empty'),
    ],
    (req, res) => {
        console.log('POST /books called with body:', req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.warn('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, author } = req.body;
        const book = createBook(title, author);
        books.push(book);
        console.log('Book successfully created:', book);

        res.status(201).json(book);
    }
);

/**
 * @openapi
 * /books-from-db:
 *   get:
 *     summary: Get books from DB with error handling
 *     responses:
 *       200:
 *         description: List of books or fallback on error
 *       400:
 *         description: Database Unavailable
 */
app.get('/books-from-db', (req, res) => {
  try {
    console.log('GET /books-from-db called');
    const booksFromDB = getBooksFromDB(); 
    res.json(booksFromDB);
  } catch (error) {
    console.log('Error fetching books from DB:', error.message);
    res.status(503).json([{ id: 0, title: "Default", author: "Default" }]);
  }
});

/**
 * @openapi
 * /books/{id}:
 *   put:
 *     summary: Update an existing book
 *     description: Updates a book with the specified ID. All fields are required and will replace the existing book data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to update
 *         example: "1234"
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
 *                 description: The updated title of the book
 *                 example: "The Great Gatsby - Revised Edition"
 *               author:
 *                 type: string
 *                 description: The updated author of the book
 *                 example: "F. Scott Fitzgerald"
 *     responses:
 *       200:
 *         description: Book successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The book ID
 *                   example: 1234
 *                 title:
 *                   type: string
 *                   description: The updated book title
 *                   example: "The Great Gatsby - Revised Edition"
 *                 author:
 *                   type: string
 *                   description: The updated book author
 *                   example: "F. Scott Fitzgerald"
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields: title and author"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Book not found"
 */
app.put('/books/:id', updateBook(books, validateBookInput));

/**
 * @openapi
 * /books/{id}:
 *   head:
 *     summary: Check if book exists by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to check
 *     responses:
 *       200:
 *         description: Book exists
 *       404:
 *         description: Book not found
 */
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