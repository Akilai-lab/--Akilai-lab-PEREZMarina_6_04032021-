const helmet = require('helmet');
//configure les entêtes http liées à la sécurité de xss
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const xss = require('xss');
//Le cross-site scripting est un type de faille de sécurité des sites web permettant d’injecter du contenu 
//dans une page, provoquant ainsi des actions sur les navigateurs web visitant la page.
//ces failles ménent à rediriger vers un autre site pour de l’hameçonnage ou encore de voler la session en récupérant les cookies.
const html = xss('<script>alert("xss");</script>');
console.log(html);
//const middleware = require('./middleware/auth');
//const Sauce = require('./models/Sauces');

const authRoutes = require('./routes/auth');
const saucesRoutes = require('./routes/sauces');

mongoose.connect(
  "mongodb+srv://bddMarina:bddMarina_11@cluster0.28t6l.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    console.log('Connexion à MongoDB réussie !');
  })
  .catch((error) => {
    console.log('Connexion à MongoDB échouée !');
    console.error(error);
  });
  app.use(helmet());
  //app.use(xss()); requires a middleware function
  app.set('trust proxy', 1) // trust first proxy
  //les session peuvent être utilisées pour s’identifier auprès du serveur et cibler ses attaques.
  //pour contrer celà on utilise express-session
  app.use( session({
    secret : 's3Cur3',
    name : 'sessionId',
    })
    // nom de cookie génériques
  );
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });  
  app.use(cors());
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());
  
  app.use('/images', express.static(path.join(__dirname, 'images')));
  
  app.use('/api/auth', authRoutes);
  app.use('/api/sauces', saucesRoutes);
module.exports = app;