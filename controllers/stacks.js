var express = require('express');
var Stack = require('../models/stack');
var User = require('../models/user');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    Stack.find(function(err, stacks) {
      if (err) return res.status(500).send(err);
      res.send(stacks);
    });
  })
  .post(function(req, res) {
    console.log("Req.body is: ",req.body.user._doc.email);
    Stack.create(req.body, function(err, stack) {
      if (err) return res.status(500).send(err);
      User.findOne({ 'email': req.body.user._doc.email}, function(err, user){
        if (err) return res.status(500).send(err);
        user.stacks.push(stack);
        user.save;
        res.send(stack);
      });      
    });
  });

router.route('/:id')
  .get(function(req, res) {
    Stack.findById(req.params.id, function(err, stack) {
      if (err) return res.status(500).send(err);
      res.send(stack);
    });
  })
  .put(function(req, res) {
    Stack.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  })
  .delete(function(req, res) {
    Stack.findByIdAndRemove(req.params.id, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  });

module.exports = router;
