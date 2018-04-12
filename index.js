'use strict'; // puede utilizar nuevas instrucciones de las versiones de javascript, como ECMA6

var mongoose = require('mongoose'); // cargamos el módulo de mongoose
var app = require('./app');
var port = process.env.PORT || 3789;

mongoose.connect('mongodb://localhost:27017/zoo', (err, res) => { // conectamos a la BD
    if (err) {
        throw err;
    } else {
        console.log('La conexión a la base de datos zoo se ha realizado corectamente');
        app.listen(port, () => {
            console.log('El servidor local con Node y Express se está ejecutando correctamente');
        })
    }
});