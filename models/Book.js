const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  author: { 
    type: String, 
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Funcție pentru a curăța indexul problematic
bookSchema.statics.cleanupIndexes = async function() {
  try {
    // Încearcă să ștergi indexul problematic pe câmpul 'id'
    await this.collection.dropIndex('id_1');
    console.log('Dropped problematic id_1 index');
  } catch (error) {
    // Dacă indexul nu există, e ok
    if (error.code === 27) {
      console.log('Index id_1 does not exist - all good');
    } else {
      console.log('Error dropping index:', error.message);
    }
  }
};

// Nu adăugăm index unic pentru a permite duplicate
// bookSchema.index({ title: 1, author: 1 }, { unique: true });

const Book = mongoose.model('Book', bookSchema);

// Curăță indexurile când se încarcă modelul
Book.cleanupIndexes().catch(console.error);

module.exports = Book;