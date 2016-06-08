var express = require('express');
var User = require('../models/user');
var router = express.Router();



router.route('/')
  .get(function(req, res) {
    // console.log("Req.body should be: ",req.user._doc.email);
    User.find({'email': req.user._doc.email}, function(err, user) {
      if (err) return res.status(500).send(err);
      // console.log("user is: ",user[0].stacks);
      res.send(user[0].stacks);
    });
  })
  .post(function(req,res){
    console.log("Req.body for newStack route is: ",req.body);
    User.update({"email": req.body.user._doc.email}, {$push: {stacks: req.body}}, function(err, stack) {
      if (err) return res.status(500).send(err);
      res.send(stack);
    });
  });


  // .post(function(req, res) {
  //   console.log("Post route Req.body is: ",req.body.user._doc.email);
  //   User.create(req.body, function(err, stack) {
  //     if (err) return res.status(500).send(err);
  //     User.findOne({ 'email': req.body.user._doc.email}, function(err, user){
  //       if (err) return res.status(500).send(err);
  //       user.stacks.push(stack);
  //       user.save;
  //       res.send(stack);
  //     });      
  //   });
  

router.route('/:id')
  .get(function(req, res) {
    User.find({"user.stacks" : req.params.id}, function(err, stack) {
      if (err) return res.status(500).send(err);
      console.log("stack is coming back as: ",stack);
      // res.send(stack);
    });
  })

  .put(function(req, res) {
    Stack.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  })
  .delete(function(req, res) {
    console.log("params should be: ",req.params.id);
    User.update(
    { _id: req.params.id },
    { $pull: { 'stacks': { _id: req.params.id } } },
    function(err){
      if (err) return res.status(500).send(err);
      console.log("success?");
      res.send({'message': 'success'});
    }
    );




    // User.findByIdAndRemove(req.params.id, function(err) {
    //   if (err) return res.status(500).send(err);
    //   console.log("success?");
    //   res.send({'message': 'success'});
    // });
  });


router.route('/:id/card')
  .post(function(req,res){
    console.log("Req.body for newCard route is: ",req.body);
    User.update({_id: req.params.id}, {$push: {cards: req.body}}, function(err, stack) {
      if (err) return res.status(500).send(err);
      res.send(stack);
    });
    // Stack.findByIdAndUpdate(req.params.id, req.body, function(err){
    //  if (err) return res.status(500).send(err);
    //  res.send(stack);  
    // })
  });







router.route('/:id/card')
  .delete(function(req, res) {
    console.log("req is: ",req);
    Stack.findByIdAndRemove(req.params.id, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  });



module.exports = router;
