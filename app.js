'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas

// Middlewares de body-parser

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Configurar cabeceras y CORS

// rutas body-parser

app.get('/probando', (req, res) => {
    res.status(200).send({
        message: 'Este es el método probando'
    })
});

module.exports = app;