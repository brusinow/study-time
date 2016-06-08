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
    User.findOne({"stacks._id" : req.params.id}, 
      function(err, stack) {
      if (err) return res.status(500).send(err);
      console.log("I want: ",stack.stacks[0].cards);
      var stackCards = stack.stacks[0].cards
      res.send(stackCards);
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
    console.log("Id from params is: ",req.params.id)
    User.update(
      {"stacks._id": req.params.id},
      { "$push": { "stacks.$.cards": req.body } },
      function(err, stack) {
      if (err) return res.status(500).send(err);
      res.send(stack);
    });
    // Stack.findByIdAndUpdate(req.params.id, req.body, function(err){
    //  if (err) return res.status(500).send(err);
    //  res.send(stack);  
    // })
  })

// Model.update(
//     { "array1.array2._id": "123" },
//     { "$push": { "array1.0.array2.$.answeredBy": "success" } },
//     function(err,numAffected) {
//        // something with the result in here
//     }
// );
// {$push: {cards: req.body}}





router.route('/:id/card')
  .delete(function(req, res) {
    console.log("req is: ",req);
    Stack.findByIdAndRemove(req.params.id, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  });



module.exports = router;
