var exress = require('express');
var medicoModel = require('../Models/medicoModel');
var mdAutenticacion = require('../middlewares/autenticacion');

var appMedico = exress();

appMedico.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    medicoModel.find({})
        .skip(desde)
        .limit(5)
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error Cargando Medicos',
                    errors: err
                });
            }
            medicoModel.countDocuments({}, (err, cantidadMedicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error Cargando Medicos',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    cantidadMedicos: cantidadMedicos
                });
            });
        });
});


appMedico.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    medicoModel.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el Medico',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Medico con el id:' + id + 'no existe en la base ',
                errors: { menssage: 'No existe el Medico' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital._id;

        medicoModel.save((err, medicoGuardo) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el Medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardo
            });
        });

    });
});


appMedico.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new medicoModel({
        nombre: body.nombre,
        hospital: body.hospital,
        usuario: req.usuario._id,
    });
    console.log(req.usuario._id);
    console.log(medico);

    medico.save((err, medicoGuarddo) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error crear Medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuarddo
        });
    });
});

appMedico.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    medicoModel.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar Medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un Medico con id:' + id,
                errors: { menssage: 'No existe Medico con id:' + id }
            });
        }
        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});

module.exports = appMedico;