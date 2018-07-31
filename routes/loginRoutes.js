var exress = require('express');
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = exress();
var usuarioModel = require('../Models/usuarioModel');
var SEED = require('../config/config').SEED;


app.post('/', (req, res) => {
    var body = req.body;
    usuarioModel.findOne({ email: body.email }, (err, usuarioBd) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usarios',
                errors: err
            });
        }
        if (!usuarioBd) {
            res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcryptjs.compareSync(body.password, usuarioBd.password)) {
            res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        usuarioBd.password = '';
        var token = jwt.sign({ usuario: usuarioBd }, SEED, { expiresIn: 14400 });
        res.status(200).json({
            ok: true,
            usuario: usuarioBd,
            id: usuarioBd.id,
            token: token
        });
    });
});

module.exports = app;