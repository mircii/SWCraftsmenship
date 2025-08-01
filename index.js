const express = require('express');

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
    return title && author;
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

app.post('/books', (req, res) => {
    const { title, author } = req.body;
    
    if (!validateBookInput(title, author)) {
        return res.status(400).json({ error: 'Missing required fields: title and author' });
    }
    
    const book = createBook(title, author);
    books.push(book);
    
    res.status(201).json(book);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
