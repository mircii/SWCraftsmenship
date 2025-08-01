const express = require('express');
const { body } = require('express-validator');
const createBookController = require('../controllers/bookController');

const createBookRoutes = (books) => {
    const router = express.Router();
    const bookController = createBookController(books);

    // Validation middleware
    const bookValidation = [
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
    ];

    /**
     * @openapi
     * /books:
     *   get:
     *     summary: Get all books
     *     responses:
     *       200:
     *         description: List of books
     */
    router.get('/', bookController.getAllBooks);

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
    router.get('/:id', bookController.getBookById);

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
    router.post('/', bookValidation, bookController.createBook);

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
     *       400:
     *         description: Bad request - Missing required fields
     *       404:
     *         description: Book not found
     */
    router.put('/:id', bookController.updateBook);

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
    router.head('/:id', bookController.checkBookExists);

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
    router.get('-from-db', bookController.getBooksFromDB);

    return router;
};

module.exports = createBookRoutes;
