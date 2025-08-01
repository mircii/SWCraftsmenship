const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/Book');
const bookRoutes = require('../routes/bookRoutes');

const app = express();
app.use(express.json());
app.use('/books', bookRoutes);

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/booksdb_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

afterEach(async () => {
  await Book.deleteMany({});
});

describe('POST /books', () => {
  it('should create a book with valid input', async () => {
    const res = await request(app)
      .post('/books')
      .send({ title: 'Test Book', author: 'Test Author' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Book');
    expect(res.body.author).toBe('Test Author');
  });

  it('should return 400 for missing title', async () => {
    const res = await request(app)
      .post('/books')
      .send({ author: 'Test Author' });
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for missing author', async () => {
    const res = await request(app)
      .post('/books')
      .send({ title: 'Test Book' });
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /books/:id', () => {
    it('should return a book by id', async () => {
    const book = new Book({ title: 'Book1', author: 'Author1', id: 12345 });
    await book.save();
    const res = await request(app).get(`/books/${book._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Book1');
    });

  it('should return 404 for non-existent book', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/books/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for invalid id', async () => {
    const res = await request(app).get('/books/invalidid');
    expect(res.statusCode).toBe(400);
  });
});