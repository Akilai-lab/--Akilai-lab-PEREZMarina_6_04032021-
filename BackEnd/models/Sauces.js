const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const sauceSchema = mongoose.Schema({
    id: {type : Object, require : true},
    userId: {type : String, require : true},
    name: {type : String, required : true},
    manufacturer: {type : String, required : true},
    description: {type : String, required : true},
    mainPepper: {type: String, required : true},
    imageUrl: {type : String, required : true},
    heat: {type : Number, required : true},
    likes: {type : Number, default:0},//1
    dislikes: {type : Number, default:0},//-1
    usersLiked: {type : Array, required : true},//on y ajoute le nom de l'user qui a aimé
    usersDisliked: {type : Array, required : true}  //on y  ajoute le nom de l'user qui n'a pas aimé
    //donc si like == 1 on va update la sauce en donnant comme réponse usersLiked = userId
});
//on crée un schema qui va contenir les données d'une sauce

sauceSchema.plugin(uniqueValidator);
// ajoute une validation de pré-sauvegarde pour les champs uniques dans le schéma.
module.exports = mongoose.model('Sauce', sauceSchema);