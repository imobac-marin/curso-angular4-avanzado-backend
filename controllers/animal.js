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

function saveAnimal(req, res) {

    var newAnimal = new animal();
    var params = req.body;

    if (params.name) {
        newAnimal.name = params.name;
        newAnimal.description = params.description;
        newAnimal.year = params.year;
        newAnimal.image = null;
        newAnimal.user = req.user.sub;

        newAnimal.save((err, animalStored) => {
            if (err) {
                res.status(500).send({
                    message: 'Error en el servidor'
                });
            } else {
                if (animalStored) {
                    res.status(200).send({
                        message: 'Animal guardado correctamente',
                        animalStored
                    });
                } else {
                    res.status(404).send({
                        message: 'No se ha guardado el animal'
                    });
                }
            }
        });
    } else {
        res.status(200).send({
            message: 'El nombre del animal es obligatorio',
        });
    }
}

module.exports = {
    pruebas,
    saveAnimal
};