var express = require('express');
var User = require('../models/user');
var router = express.Router();
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;


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



router.route("/community/") 
  .get(function(req, res){
    User.aggregate([ 
    // { "$unwind" : "$_id" },
    { "$unwind" : "$stacks" },
    { "$match" : {"stacks.public" : true}}
      ],
      function(err, stacks) {
        console.log("stacks are: ",stacks);
      if (err) return res.status(500).send(err);
       res.send(stacks);
    });
  })

router.route("/community/:id") 
  .get(function(req, res) {
    console.log("req.params should be: ",req.params.id);
    User.find({"stacks._id" : req.params.id},{stacks: {$elemMatch: {_id: req.params.id}}}, 
      function(err, stack) {
        console.log("stack is: ",stack);
        // var stackCards = stack[0].stacks[0];
      if (err) return res.status(500).send(err);
      console.log("I want: ",stack[0].stacks[0]);
      var stack = stack[0].stacks[0]
      res.send(stack);
    });
  })





router.route('/:id')
  .get(function(req, res) {
    console.log(req.params.id);
    User.find({"stacks._id" : req.params.id},{stacks: {$elemMatch: {_id: req.params.id}}}, 
      function(err, stack) {
        // console.log("stack is: ",stack[0].stacks[0]);
        var stackCards = stack[0].stacks[0];
      if (err) return res.status(500).send(err);
      // console.log("I want: ",stack.stacks[0].cards);
      // var stackCards = stack.stacks[0].cards
      res.send(stackCards);
    });
  })
  .delete(function(req, res) {
    console.log("params should be: ",req.params.id);
    User.update(
    {},
    { "$pull": { 'stacks': {"_id" : req.params.id} } },
    function(err){
      if (err) return res.status(500).send(err);
      console.log("success?");
      res.send({'message': 'success'});
    }
    );
  });


router.route('/:id/edit')
  .get(function(req,res){
    User.find(
      {"stacks._id" : req.params.id},
      {stacks: {$elemMatch: {_id: req.params.id}}}, 
      function(err, stack) {
        console.log("stack is: ",stack);
        var stackCards = stack[0].stacks[0];
      if (err) return res.status(500).send(err);
      // console.log("I want: ",stack.stacks[0].cards);
      // var stackCards = stack.stacks[0].cards
      res.send(stackCards);
    });
  })
  .post(function(req,res){
    console.log("Req.body for editStack route is: ",req.body);
    console.log("should be stack id: ",req.params.id);
    User.update(
      {"stacks._id": req.params.id},
      { "$set" : {"stacks.$": req.body}},
   
      function(err, stack) {
      if (err) return res.status(500).send(err);
      res.send(stack);
    });
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




router.route('/:id/card/:id')  
  .delete(function(req, res) {
    console.log("hitting card delete route");
    console.log("req.params is: ",req.params);
    User.update(
    {"stacks.cards._id": req.params.id},
    { "$pull": { "stacks.$.cards": {"_id" : req.params.id}}},
     function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  });


router.route('/:stackId/:cardId/card/edit')
  .get(function(req,res){
    User.aggregate([ 
    // { "$unwind" : "$_id" },
    { "$unwind" : "$stacks" },
    { "$match" : {"stacks._id" : ObjectId(req.params.stackId) }},
    { "$unwind" : "$stacks.cards"},
    { "$match" : {"stacks.cards._id" : ObjectId(req.params.cardId) }}
      ],
      function(err, card) {
        var thisCard = card[0].stacks.cards;
      if (err) return res.status(500).send(err);
       res.send(thisCard);
    });
  })
  .post(function(req,res){
    //console.log("Req.body for editCard route is: ",req.body);
    //console.log("should be card id: ",req.params.cardId);
    User.findOne({"stacks._id": req.params.stackId}, function(err, user) {
      // console.log('Stack ID: ', ObjectId(user.stacks[1]._id).toString());
      // console.log(typeof(ObjectId(user.stacks[1]._id).toString()));
      // console.log('Incoming Stack ID: ', req.params.stackId)
      // console.log(typeof(req.params.stackId));
      for(var i = 0; i < user.stacks.length; i++) {
        //console.log('Stack ID: ', user.stacks[i]._id);
        if(req.params.stackId === ObjectId(user.stacks[i]._id).toString()) {
          console.log('Stack ID: ', user.stacks[i]._id);
          for(var j = 0; j < user.stacks[i].cards.length; j++) {
            if(req.params.cardId === ObjectId(user.stacks[i].cards[j]._id).toString()) {
              console.log('Card ID', user.stacks[i].cards[j]._id);
              user.stacks[i].cards[j] = req.body;
            }
          }
        }
      }

      user.save().then(function(err, user) {
      res.send(user);
      });

      // User.update({_id: user._id}, {$set : {"stacks.stackIndex.cards.$": req.body}}, function(err, card) {
      //   console.log(card),
      //   console.log(err);
      // });
    });
    // User.update(
    //   {"stacks._id": req.params.stackId}, {$set: {"stacks.$.cards": {_id: req.params.cardId}}}
    //   // {"stacks._id" : req.params.stackId, "stacks.cards._id": req.params.cardId},
    //   // { "$set" : {"stacks.$.cards": req.body}},
   
    //   function(err, card) {
    //   if (err) return res.status(500).send(err);
    //   console.log(card);
    //   //res.send(card);
    // });
  });
 // User.find({"stacks._id" : req.params.id},{stacks: {$elemMatch: {_id: req.params.id}}}, 
// db.schools.find( { zipcode: "63109" },
//                  { students: { $elemMatch: { school: 102 } } } )

// .delete(function(req, res) {
//     console.log("params should be: ",req.params.id);
//     User.update(
//     {},
//     { "$pull": { 'stacks': {"_id" : req.params.id} } },
//     function(err){
//       if (err) return res.status(500).send(err);
//       console.log("success?");
//       res.send({'message': 'success'});
//     }
//     );
module.exports = router;
