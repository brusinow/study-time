var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema = new mongoose.Schema({
  question: String,
  answer: String,
  image: String,
  category: String
});

var StackSchema = new mongoose.Schema({
  name: String,
  cards: [{ type: Number, ref: 'Cards' }]
});

var Cards  = mongoose.model('Cards', CardSchema);
var Stack = mongoose.model('Stack', StackSchema);

module.exports = mongoose.model('Stack', StackSchema);