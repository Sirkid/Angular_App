var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var jwt = require('jwt-simple');

var User = require('./models/User.js');
var Post = require('./models/Post.js')
var auth = require('./auth.js')

mongoose.Promise = Promise;

app.use(cors());
app.use(bodyParser.json());

app.get('/posts/:id', async (req, res)=> {
  var author = req.params.id
  var posts = await Post.find({author})
  res.send(posts)
});

app.post('/post', auth.checkAuthenticated, (req, res) => {
  var postData = req.body
  postData.author = req.userId

  var post = new Post(postData)

  post.save((err, result) => {
    if (err) {
    console.error('saving post error'); 
    return res.status(500).send({message: 'saving post error'})
    }
    res.sendStatus(200);
  })
})

app.get('/users', async (req, res)=> {
  // ({}) empty object to get entire list of users
  // - to remove pwd and version
  try {
    var users = await User.find({}, '-pwd -__v')
    res.send(users)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
});

app.get('/profile/:id', async (req, res)=> {
    try {
      var user = await User.findById(req.params.id, '-pwd -__v')
      res.send(user)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  });
// app.post('/register', auth.register);
// app.post('/login', auth.login);
// { useMongoClient: true },
mongoose.connect('mongodb+srv://psadmin:Password123@pssocial.tjq2t.mongodb.net/pssocial?retryWrites=true&w=majority', (err) => {
    if (!err)
    console.log('connected to mongo');
});

app.use('/auth', auth.router);
app.listen(process.env.PORT || 80);