const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //on va créer un token d'authorisation random
    const userId = decodedToken.userId;
    //on vérifie le token de l'user pour son authorisation
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
      //si la requête de l'userId n'est pas égal à l'userId on a une erreur
    } else {
      console.log(token);
      //sinon on affiche le token
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};