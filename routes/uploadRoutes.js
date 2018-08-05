var exress = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var Usuarios = require('../Models/usuarioModel');
var Hospitales = require('../Models/hospitalesModel');
var Medicos = require('../Models/medicoModel');


var app = exress();


app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    console.log(id);
    //tipo de colecciones 
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colleccion no vlaida',
            errors: { menssage: 'Tipo de colleccion no vlaida' }
        });

    }

    if (!req.files) {
        res.status(400).json({
            ok: false,
            mensaje: 'no selecciono ninguna imagen',
            errors: { menssage: 'Debe seleccionar una imagen' }
        });
    }

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extencionArchiovo = nombreCortado[nombreCortado.length - 1];
    var extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionesValidas.indexOf(extencionArchiovo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extención no valida',
            errors: { menssage: 'Las extenciones validas son: ' + extencionesValidas.join(', ') }
        });
    }

    // Nombre Personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extencionArchiovo }`;


    //Mover archivo del temporal a un path especifico
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al enviar archivo al servidor',
                errors: { menssage: 'Error al enviar archivo al servidor' }
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
    })
});


function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === "usuarios") {
        Usuarios.findById(id, (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    mensaje: 'Error, no se encontro usuario con id:' + id
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Error al actualixar usuario: ' + usuario.nombre
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if (tipo === "hospitales") {

        Hospitales.findById(id, (err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    mensaje: 'Error, no se encontro Hospital con id:' + id
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Error al actualixar hospital: ' + hospital.nombre
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen hospital actualizada',
                    hospital: hospitalActualizado
                });
            });
        });

    }

    if (tipo === "medicos") {
        Medicos.findById(id, (err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    mensaje: 'Error, no se encontro Medico con id:' + id
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Error al actualixar medico: ' + medico.nombre
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen medico actualizada',
                    medico: medicoActualizado
                });
            });
        });


    }

}

module.exports = app;