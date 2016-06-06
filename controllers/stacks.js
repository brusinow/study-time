var express = require('express');
var Stack = require('../models/stack');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    Stack.find(function(err, recipes) {
      if (err) return res.status(500).send(err);
      res.send(recipes);
    });
  })
  .post(function(req, res) {
    Stack.create(req.body, function(err, recipe) {
      if (err) return res.status(500).send(err);
      res.send(recipe);
    });
  });

router.route('/:id')
  .get(function(req, res) {
    Stack.findById(req.params.id, function(err, recipe) {
      if (err) return res.status(500).send(err);
      res.send(recipe);
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
