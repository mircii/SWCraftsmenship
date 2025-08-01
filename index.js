const express = require('express');

const { body, validationResult } = require('express-validator');

// Configuration
const PORT = 3000;
const app = express();

// Middleware
app.use(express.json());

// Data storage
const books = [];

// Helper functions
const findBookById = (id) => {
    return books.find(book => book.id == id);
};

const generateBookId = () => {
    return Math.floor(Math.random() * 10000);
};

const validateBookInput = (title, author) => {
    return (
        typeof title === 'string' &&
        typeof author === 'string' &&
        title.trim().length > 0 &&
        author.trim().length > 0
    );
};


const createBook = (title, author) => {
    return {
        id: generateBookId(),
        title: title,
        author: author
    };
};

// Routes
app.get('/books', (req, res) => {
    res.json(books);
});

app.get('/books/:id', (req, res) => {
    const book = findBookById(req.params.id);
    
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});


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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, author } = req.body;
        const book = createBook(title, author);
        books.push(book);

        res.status(201).json(book);
    }
);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
