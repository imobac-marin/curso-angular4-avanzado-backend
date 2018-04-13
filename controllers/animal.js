'use strict'

// modulos
var fs = require('fs');
var path = require('path');

// modelos
var user = require('../models/user');
var animal = require('../models/animal');

// acciones
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de animal y la acción pruebas',
        user: req.user
    });
}

module.exports = {
    pruebas
};