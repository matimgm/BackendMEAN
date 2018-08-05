var exress = require('express');
var app = exress();
var Hospital = require('../Models/hospitalesModel');
var Medicos = require('../Models/medicoModel');
var Usuarios = require('../Models/usuarioModel');

//Busqueda por coleccion
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: "Los tipos de busqueda solo son hospitales, medicos, usuarios",
                error: { message: "Tipo de table/coleccion no valida" }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    })
});


app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        })
});


function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex }, (err, hospitales) => {
            if (err) {
                reject('Error al cargar hospitales', err);
            } else {
                resolve(hospitales);
            }
        });
    });
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Medicos.find({ nombre: regex }, (err, medicos) => {
            if (err) {
                reject('Error al cargar Medicos', err);
            } else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Usuarios.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar Usaurios', err);
                } else {
                    resolve(usuarios);
                }
            })
    });
}

module.exports = app;