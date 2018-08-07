var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioModel = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, unique: true, required: [true, 'EL email es obligatorio'] },
    password: { type: String, required: [true, 'La contraseña es obligatorio'] },
    img: { type: String },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, required: true, default: false }
});

usuarioModel.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
var User = mongoose.model('Usuarios', usuarioModel);
module.exports = User;