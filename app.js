// Requires (Importacion librerias)
var exress = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = exress();

// Conexion a base de datos mongodb
mongoose.connection.openUri('mongodb://localhost:27017/DbMean', (err, res) => {
    if (err) throw err;

    console.log('Bse de datos server: \x1b[32m%s\x1b[0m', 'online !!');
});


// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});



// Escuchar peticiones 
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online !!');
});