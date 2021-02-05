const mongoose      = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String, 
        unique: true, 
        required: [true, 'El nombre es necesario'] 
    },
    descripcion: { 
        type: String, 
        required: [true, 'La descripcion es necesaria'] 
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    estado:{
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);
