var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
// var env = process.env.NODE_ENV || 'deployment';
var app = express();


var secret = "mysupersecretpassword";

var mongoose = require('mongoose');
var User = require('./models/user');
// mongoose.connect("mongodb://"+process.env.DBUSER+":"+process.env.DBPASSWORD+"@ds011314.mlab.com:11314/studytime");
mongoose.connect('mongodb://localhost/study_time');



app.use(session({
  secret: 'dsalkfjasdflkjgdfblknbadiadsnkl',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  currentUser: ''
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/stacks', expressJWT({secret: secret}));
app.use('/api/users', expressJWT({secret: secret})
.unless({path: ['/api/users'], method: 'post'}));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({message: 'You need an authorization token to view this information.'})
  }
});

app.use('/api/stacks', require('./controllers/stacks'));
app.use('/api/users', require('./controllers/users'));

app.post('/api/auth', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (err || !user) return res.status(401).send({message: 'User not found'});
    user.authenticated(req.body.password, function(err, result) {
      if (err || !result) return res.status(401).send({message: 'User not authenticated'});

      var token = jwt.sign(user, secret);
      res.send({user: user, token: token});
    });
  });
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT || 3000)
