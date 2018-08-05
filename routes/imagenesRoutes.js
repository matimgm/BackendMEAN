var exress = require('express');
var fs = require('fs');
var app = exress();

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.tipo;

    var path = `./uploads/${ tipo }/${ img }`;

    fs.exists(path, exists => {
        if (!exists) {

            path = './assets/imagenblanco.jpg';
        }

        res.sendfile(path);
    })
});

module.exports = app;