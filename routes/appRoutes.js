// Requires (Importacion librerias)
var exress = require('express');
var app = exress();

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

module.exports = app;