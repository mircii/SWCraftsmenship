const { validationResult } = require('express-validator');
const Book = require('../models/Book');
const xss = require('xss');

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
  console.log('=== CREATE BOOK REQUEST ===');
  console.log('Request body:', req.body);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const title = xss(req.body.title);
    const author = xss(req.body.author);
    console.log(`Attempting to create book: title="${title}", author="${author}"`);
    
    const existingBook = await Book.findOne({ title, author });
    if (existingBook) {
      console.log('Book already exists:', existingBook);
      return res.status(409).json({ error: 'Book with same title and author already exists' });
    }
    
    const book = new Book({ title, author });
    console.log('Book object created, attempting to save...');
    
    await book.save();
    console.log('Book saved successfully:', book);
    
    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    console.error('Error details:', error.message);
    res.status(400).json({ error: 'Invalid data', details: error.message });
  }
};

// PUT update book
const updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const title = xss(req.body.title);
    const author = xss(req.body.author);
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