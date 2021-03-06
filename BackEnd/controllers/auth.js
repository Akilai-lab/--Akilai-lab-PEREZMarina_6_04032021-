const User = require('../models/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const CryptoJS = require('crypto-js');

 exports.signup = (req, res, next) => { 
  try{
    let cryptedMail = CryptoJS.SHA3(req.body.email).toString();
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          'email': cryptedMail,
          'password': hash
        });
        user.save()
          .then(() => res.status(201).json({"message": 'Utilisateur créé !' }))
          .catch(error => {
            console.log(error)
            res.status(400).json({ error })
          });
      })
      .catch(error => res.status(500).json({ error }));
    }catch(error){
      console.log(error.message);
    }
};

exports.login = (req, res, next) => {
  try{
    let cryptedMail = CryptoJS.SHA3(req.body.email).toString();
    User.findOne({ email : cryptedMail }).then(user => {
    bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if (!valid) {
          return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        res.status(200).json({
          "userId": user._id,
          token: jwt.sign(
            { userId: user._id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' }
          )
        });
      })
      .catch(error =>{
        console.log(error)
        res.status(500).json({ error })
    });
  });
  }catch(error){
    console.log(error.message);
  }
};

