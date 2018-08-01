var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var medicoShema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'El id hospital es un campo obligatorio']
    }
});
module.exports = mongoose.model('Medico', medicoShema);