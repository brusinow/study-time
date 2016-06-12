var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var StackSchema = new mongoose.Schema({
  userId: String,
  name: String,
  public: Boolean,
    cards: [{
      question: String,
      answer: String,
      image: String,
      category: String
    }]
});

// var Cards  = mongoose.model('Cards', CardSchema);
var Stack = mongoose.model('Stack', StackSchema);
module.exports = mongoose.model('Stack', StackSchema);

