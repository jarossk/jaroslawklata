var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new mongoose.Schema({
  title: String,
  description: String
});

mongoose.model('Book', bookSchema);