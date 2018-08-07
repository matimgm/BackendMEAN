var exress = require('express');
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = exress();
var usuarioModel = require('../Models/usuarioModel');
var SEED = require('../config/config').SEED;


const GOOGLE_CLIENTE_ID = require('../config/config').GOOGLE_CLIENTE_ID;


var { OAuth2Client } = require('google-auth-library');


app.post('/google', (req, res) => {
    var token = req.body.token;

    const client = new OAuth2Client(GOOGLE_CLIENTE_ID);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENTE_ID,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];


        usuarioModel.findOne({ email: payload.email }, (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usarios',
                    errors: err
                });
            }

            if (usuario) {
                if (usuario.google === false) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Debe iniciar session con autentificacion nomrmal'
                    });
                } else {
                    usuario.password = '';
                    var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 });
                    res.status(200).json({
                        ok: true,
                        usuario: usuario,
                        id: usuario.id,
                        token: token
                    });
                }

            } else {
                var usuario = new usuarioModel();

                usuario.nombre = payload.name;
                usuario.email = payload.email;
                usuario.password = ':)';
                usuario.img = payload.picture;
                usuario.google = true;

                usuario.save((err, usuarioDb) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al crear nuevo usuario - google',
                            errors: err
                        });
                    }

                    var token = jwt.sign({ usuario: usuarioDb }, SEED, { expiresIn: 14400 });
                    res.status(200).json({
                        ok: true,
                        usuario: usuarioDb,
                        id: usuarioDb.id,
                        token: token
                    });
                })
            }

        })
    }
    verify().catch(console.error);


});



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