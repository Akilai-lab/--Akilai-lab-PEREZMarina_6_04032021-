const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const authSchema = mongoose.Schema({ 
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}   
});
//on crée un schema qui va contenir un email et un password
authSchema.plugin(uniqueValidator);
// ajoute une validation de pré-sauvegarde pour les champs uniques dans le schéma.
module.exports = mongoose.model('Auth', authSchema);
//on exporte le model