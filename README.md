# Software Craftsmanship Starter Project

This is a basic Express.js project for practicing clean code, REST API design, input validation, error handling, and graceful degradation.

## 📦 Setup

1. Make sure you have Node.js installed
2. Run the following commands:

```bash
npm install
npm start
```

The server will start at: [http://localhost:3000](http://localhost:3000)

## 📚 Available Endpoints

### GET /books
Returns all books.

### GET /books/:id
Returns a specific book by ID.

### POST /books
Creates a new book.

**Example JSON body:**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin"
}
```

## ✅ Tasks for You

- Add input validation using `express-validator` or a custom function
- Add PUT /books/:id (update)
- Add HEAD /books/:id (check if exists)
- Add logging and error handling
- Add graceful fallback logic (simulate failure scenarios)
- Optionally: Add Swagger documentation

Happy crafting! 🛠️
