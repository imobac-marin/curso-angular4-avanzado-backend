'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas

var userRoutes = require('./routes/user');
var animalRoutes = require('./routes/animal');

// Middlewares de body-parser

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Configurar cabeceras y CORS

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested_With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, PUT, OPTIONS, PUT, DELETE');
    next();
});

// rutas base
app.use('/api', userRoutes);
app.use('/api', animalRoutes);

// rutas body-parser

app.get('/probando', (req, res) => {
    res.status(200).send({
        message: 'Este es el método probando'
    });
});

module.exports = app;