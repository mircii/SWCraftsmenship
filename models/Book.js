const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  id: { type: Number, required: true, unique: true }
});

module.exports = mongoose.model('Book', bookSchema);