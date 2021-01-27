const mongoose      = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

let rolesValidor = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password:{
        type: String,
        required: [true, 'El password es necesario']
    },
    img:{
        type: String,
        required: false
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidor
    },
    estado:{
        type: Boolean,
        default: true,
    },
    google:{
        type: Boolean,
        default: false,
    }
});

usuarioSchema.methods.toJSON = function() {
    
    let user = this;
    let userOBJ = user.toObject();
    delete userOBJ.password;

    return userOBJ;
}

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser unico'})

module.exports = mongoose.model('Usuario', usuarioSchema)