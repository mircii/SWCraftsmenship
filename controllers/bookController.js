const { validationResult } = require('express-validator');
const Book = require('../models/Book');

// GET all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid book ID' });
  }
};

const createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, author } = req.body;
  
    let randomId, exists;
    do {
      randomId = Math.floor(Math.random() * 1000000) + 1;
      exists = await Book.findOne({ id: randomId });
    } while (exists);

    const book = new Book({ title, author, id: randomId });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

// PUT update book
const updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, author } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author },
      { new: true, runValidators: true }
    );
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid book ID or data' });
  }
};

// HEAD check book exists
const checkBookExists = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(400);
  }
};

// GET books from DB with error handling (exemplu fallback)
const getBooksFromDB = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(503).json([{ id: 0, title: "Default", author: "Default" }]);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  checkBookExists,
  getBooksFromDB
};