var exress = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

var app = exress();

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Importar Rutas
var appRouetes = require('./routes/appRoutes');
var usuarioRoutes = require('./routes/usarioRoutes');
var loginRoutes = require('./routes/loginRoutes');
var hospitalRoutes = require('./routes/hospitalRoutes');
var medicosRoutes = require('./routes/medicosRoutes');
var busquedaRoutes = require('./routes/busquedaRoutes');
var uploadRoute = require('./routes/uploadRoutes');
var imagenesRoutes = require('./routes/imagenesRoutes');

// Conexion a base de datos mongodb
mongoose.connection.openUri('mongodb://localhost:27017/DbMean', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Bse de datos server: \x1b[32m%s\x1b[0m', 'online !!');
});


// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicosRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoute);
app.use('/img', imagenesRoutes);

app.use('/', appRouetes);

// Escuchar peticiones 
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online !!');
});