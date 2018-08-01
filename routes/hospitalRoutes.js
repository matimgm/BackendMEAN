var exress = require('express');
var hospitalModel = require('../Models/hospitalesModel');
var mdAutenticacion = require('../middlewares/autenticacion');

var appHospital = exress();

appHospital.get('/', (req, res) => {
    hospitalModel.find({}).exec((err, hospitales) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error Cargando Hospitales',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hospitales: hospitales
        });
    });
});


appHospital.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    hospitalModel.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el hospital',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id:' + id + 'no existe en la base ',
                errors: { menssage: 'No existe el hospital' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hsopital: hospitalGuardado
            });
        });

    });
});


appHospital.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new hospitalModel({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error crear hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
});

appHospital.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    hospitalModel.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con id:' + id,
                errors: { menssage: 'No existe hospital con id:' + id }
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});

module.exports = appHospital;