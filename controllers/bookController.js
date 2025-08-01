const { validationResult } = require('express-validator');

// Helper functions
const findBookById = (books) => (id) => {
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

// Controller functions
const createBookController = (books) => {
    return {
        // GET all books
        getAllBooks: (req, res) => {
            console.log('GET /books called');
            try {
                res.json(books);
            } catch (error) {
                console.error('Unexpected error in GET /books:', error.message);
                res.status(500).json({ error: 'Internal server error' });
            }
        },

        // GET book by ID
        getBookById: (req, res) => {
            console.log(`GET /books/${req.params.id} called`);
            try {
                const book = findBookById(books)(req.params.id);
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
        },
        

        // POST create book
        createBook: (req, res) => {
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
        },

        // PUT update book
        updateBook: (books, validateBookInput) => (req, res) => {
            const bookId = req.params.id;
            const { title, author } = req.body;

            const bookIndex = books.findIndex(book => book.id == bookId);
            
            if (bookIndex === -1) {
                return res.status(404).json({ error: 'Book not found' });
            }

            if (!validateBookInput(title, author)) {
                return res.status(400).json({ error: 'Missing required fields: title and author' });
            }

            books[bookIndex] = {
                id: parseInt(bookId),
                title: title,
                author: author
            };
            
            res.status(200).json(books[bookIndex]);
        },

        // HEAD check book exists
        checkBookExists: (req, res) => {
            const book = findBookById(books)(req.params.id);
            if (book) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        },

        // GET books from DB with error handling
        getBooksFromDB: (req, res) => {
            try {
                console.log('GET /books-from-db called');
                const booksFromDB = getBooksFromDB();
                res.json(booksFromDB);
            } catch (error) {
                console.log('Error fetching books from DB:', error.message);
                res.status(503).json([{ id: 0, title: "Default", author: "Default" }]);
            }
        }
        
    };
    
};

module.exports = createBookController;