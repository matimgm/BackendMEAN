var exress = require('express');
var bcryptjs = require('bcryptjs');
var usuarioModel = require('../Models/usuarioModel');
var mdAutenticacion = require('../middlewares/autenticacion');

var appUsuario = exress();

appUsuario.get('/', (req, res, next) => {
    usuarioModel.find({}, (err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error Cargando usuarios',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuarios: usuarios
        });
    });
});


appUsuario.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    usuarioModel.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id:' + id + 'no existe en la base ',
                errors: { menssage: 'No existe el usuario' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = '';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });

    });
});

appUsuario.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var usuario = new usuarioModel({
        nombre: body.nombre,
        email: body.email,
        password: bcryptjs.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error crear usario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});

appUsuario.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    usuarioModel.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con id:' + id,
                errors: { menssage: 'No existe usuairo con id:' + id }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = appUsuario;