// PUT method for updating a book
const updateBook = (books, validateBookInput) => (req, res) => {
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
};

module.exports = updateBook;