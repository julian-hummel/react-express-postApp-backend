var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const User = require('../models/User');
var validator = require('validator');
var lodash = require('lodash');
require('dotenv/config');

function validateSignupInput(data) {
  let errors = {};
  
  if(!validator.equals(data.password, data.repeatPassword)) {
    errors.repeatPassword = "Die Passwörter stimmen nicht überein"
  } 
   
  return {
    errors,
    isValid: lodash.isEmpty(errors)
  }
}

//Returns all the registered users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  }catch(err) {
    res.json({ message: err});
  }
});

//Returns the user information of the current user
router.get('/profile', (req, res) => {
  const errors = {}

  if(req.headers['authorization']) {
    var token = req.headers['authorization'].split(' ')[1]
    try {
      var decoded = jwt.verify(token, process.env.SECRET_KEY);
    }catch(err) {
      errors.tokenExpired = "Ihre Sitzung ist abgelaufen. Bitte loggen Sie sich erneut ein"
      res.status(200).json({ errors })
    }
  }else {
    errors.user = "Sie haben auf diese Seite keinen Zugriff. Bitte loggen Sie sich ein."
    res.status(200).json({ errors })
  }
  
  User.findOne({
    _id: decoded._id 
  })
  .then(user => {
    if(user) {
      res.json(user)
    }else {
      res.send("User does not exist")
    }
  })
  .catch(err => {
    res.send('error: ' + err);
  }) 
});

/*
 * Creates a new user. If the given email is already registered, there is no new user registered
 * The password is hashed with bcrypt
 */
router.post('/register', (req, res) => {
  const { errors, isValid } = validateSignupInput(req.body);

  if(!isValid) {
    res.status(200).json({ errors });
  }else {
    const today = new Date();
    const { firstName, lastName, email, password, repeatPassword } = req.body;
    const userData = { firstName, lastName, email, password, repeatPassword, created: today }

    User.findOne({
      email: req.body.email
    })
    .then(user => {
      if(!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;
          userData.repeatPassword = hash;
          User.create(userData)
          .then(user => {
            res.json({ status: user.email + ' registered!'});
          })
          .catch(err => {
            res.send('error: ' + err);
          })
        })
      }else {
        errors.user = "Der Nutzer existert bereits"
        res.status(200).json({ errors })
      }
    })
    .catch(err => {
      res.send('error: ' + err);
    })
  }
});

/*
 * Login for a user. If either the email is not registered or the password does´t match, error is sent back.
 * For a successful login, a jwt token is sent back, which expires after 24 minutes.
 */
router.post('/login', (req, res) => {
  const errors = {}

  User.findOne({
    email: req.body.email
  })
  .then(user => {
    if(user) {
      if(bcrypt.compareSync(req.body.password, user.password)) {
        const payload = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
        let token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: 1440
        })
        res.send(token);
      }else {
        errors.login = "Die Login Daten sind falsch"
        res.status(200).json({ errors })
      }
    }else {
      errors.login = "Die Login Daten sind falsch"
      res.status(200).json({ errors })
    }
  })
  .catch(err => {
    res.send('error ' + err)
  })
});

router.get('/validateToken', (req, res) => {
  const errors = {}
  if(req.headers['authorization']) {
    var token = req.headers['authorization'].split(' ')[1]
    try {
      jwt.verify(token, process.env.SECRET_KEY)
      res.send({ message: "Das Token ist gültig"})
    }catch(err) {
      errors.tokenExpired = "Ihre Sitzung ist abgelaufen. Bitte loggen Sie sich erneut ein"
      res.status(200).json({ errors })
    }
  }
})

module.exports = router;
