const Sauce = require('../models/Sauces');
// on importe le model des sauces

const fs = require('fs');
//donne accès aux fonctions qui permettent de modifier le système de fichiers et aux fonctions permettant de supprimer les fichiers.
const bcrypt = require('bcrypt');
//l'algorithme bcrypt codé
const jwt = require('jsonwebtoken');
const { replaceOne } = require('../models/Sauces');
//token d'authentification

exports.createSauce = (req, res, next) => {
  //on exporte une fonction post qui permet d'ajouter des sauces à la page d'accueil avec comme route /
  const sauceObject = JSON.parse(req.body.sauce);
  //il s'agit de déclarer une constante qui va transformer l'objet JSON en objet
  delete sauceObject._id;
  //supprime l'id de la sauce objet faussée
    const sauce = new Sauce({
      //déclaration d'une constante qui a comme valeur le model des sauces
      ...sauceObject,
      //ici on valide les éléments requis à l'enregistrement des données d'une sauce
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      //on défini l'url de l'image liée à la sauce actuellement postée
    });
    sauce.save()
    //console.log(sauce)
    //on enregistre la sauce sur la bdd
      .then((sauce) =>  {
        //une fois que la sauce est ajoutée à la bdd on précise que l'ajout de la sauce a été fait
        res.status(201).json({message : 'ajout sauce'})
      })
      .catch(error => {
        //si l'ajout ne s'est pas fait on déclare une erreur que l'on affichera en console et qui aura sur le nav  en console une erreur 400
        console.log(error);
        res.status(400).json({ error });
    });
};

exports.getOneSauce = (req, res, next) => {
  //récupérer l'id et afficher les infos
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      res.status(200).json(sauce)
    })
    .catch(error => {
      console.log(console.error());
      res.status(400).json({ error });
    })
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
  .then(() => {
    console.log(Sauce)
    res.status(200).json({ message: 'Objet modifié !'})
  })
  .catch(error => {
    console.log(error)
    res.status(400).json({ error })
  })
};

exports.deleteSauce = (req, res, next) => {
  //*ngIf="userId === sauce.userId"
  Sauce.findOne({ _id: req.params.id })
  .then(sauce =>{
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'La sauce a bien été supprimée !'}))
          .catch(error => {
            console.log(error)
            res.status(400).json({ error })
          });
    })
  })
  .catch(error => res.status(500).json({ error }));
};
exports.likeASauce = (req, res, next) => {
// on récupére les données de Sauce
  let like = req.body.like;
  const userId = req.body.userId;

  switch (like) {
    case 1 :
      Sauce.updateOne({ _id: req.params.id }, { $addToSet : { usersLiked : userId } , $inc: {likes : 1}})
      .then( () => res.status(201).json({message : "j'aime"}))
      .catch(error => res.status(404).json({error : error}))
      break;
    case 0:
      if({usersLiked : userId}) {
        Sauce.updateOne({ _id: req.params.id }, {$pull : { usersLiked : userId }, $set: {likes : 0}})
        .then( () => res.status(201).json({message : "je n'aime pas"}))
        .catch(error => res.status(404).json({error : error}))
      }
      if({usersDisliked : userId}) {
        Sauce.updateOne({ _id: req.params.id }, {$pull : { usersDisliked : userId } , $set: {dislikes : 0}})
        .then( () => res.status(201).json({message : "je n'aime pas"}))
        .catch(error => res.status(404).json({error : error}))
      }
      break;
    case -1:
      Sauce.updateOne({ _id: req.params.id }, { $addToSet : { usersDisliked : userId } , $inc: {dislikes : -1}})
      .then( () => res.status(201).json({message : "je n'aime pas"}))
      .catch(error => res.status(404).json({error : error}))
      break;
    default:
      console.log('erreur');
  }
};

exports.getAllSauces =  (req, res, next) => {
  //renvoi tableau de toutes les sauces dans bdd
  Sauce.find()
  //récupération des sauces
    .then((Sauce) => {res.send(Sauce)})
    //qd les sauces sont récupéréer, on envoi les sauces
    //.then(() => {res.status(201).json( {message :'sauces bien récupérées'})})
    .catch(error => {
      console.log(error);
      res.send(console.error());
      res.status(400).json({ error });
     }
    );
}