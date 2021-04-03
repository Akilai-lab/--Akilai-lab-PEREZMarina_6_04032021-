const User = require('../models/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const CryptoJS = require('crypto-js');
const  MaskData  =  require ( 'maskdata' ) ;
const  emailMask2Options  =  { 
  maskWith : "*" ,  
  unmaskedStartCharactersBeforeAt : 3 , 
  unmaskedEndCharactersAfterAt : 2 , 
  maskAtTheRate : false 
}
/*const  emailMask2Options  =  { 
    maskWith : "*" ,  
    unmaskedStartCharactersBeforeAt : 3 , 
    unmaskedEndCharactersAfterAt : 2 , 
    maskAtTheRate : faux 
} ;

const  email  =  "mon.test.email@testEmail.com" ;

const  maskedEmail  =  MaskData . maskEmail2 ( email ,  emailMask2Options ) ;
*/
// Sortie: my.********@**********om
 exports.signup = (req, res, next) => { 
  try{
    //let cryptedMail = CryptoJS.SHA3(req.body.email).toString();
    const  maskedEmail  =  MaskData.maskEmail2(req.body.email, emailMask2Options);
    console.log(maskedEmail);
    //on crée une constante qui va masquer le mail de l'utilisateur
    bcrypt.hash(req.body.password, 10)
    //on crypte le mot de passe
      .then(hash => {
        const user = new User({
          'email': maskedEmail,
          'password': hash
        });
        user.save()
        //on enregistre les information de l'utilisateur
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
    const  maskedEmail  =  MaskData.maskEmail2(req.body.email, emailMask2Options);
    //let cryptedMail = CryptoJS.SHA3(req.body.email).toString();
    //on masque l'adresse mail pour qu'elle soit reconnue par la bdd
    console.log(maskedEmail);
    User.findOne({ email :maskedEmail}).then(user => {
      //on va rechercher les données de l'utilisateur 
      //et comparer le mod de passe tapé à celui de la bdd
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

