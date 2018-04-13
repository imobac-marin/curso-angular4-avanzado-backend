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

function getAnimals(req, res) {
    animal.find({}).populate({
        path: 'user'
    }).exec((err, animals) => {
        if (err) {
            res.status(500).send({
                message: 'No se ha podido realizar la búsqueda de animales'
            });
        } else {
            if (!animals) {
                res.status(404).send({
                    message: 'No se han encontrado animales'
                });
            } else {
                res.status(200).send({
                    animals
                });
            }
        }
    });
}

function getAnimal(req, res) {
    var animalId = req.params.id;

    animal.findById(animalId).populate({
        path: 'user'
    }).exec((err, animalFromDb) => {
        if (err) {
            res.status(500).send({
                message: 'No se ha podido realizar la búsqueda del animal'
            });
        } else {
            if (!animalFromDb) {
                res.status(404).send({
                    message: 'No se ha encontrado el animal'
                });
            } else {
                res.status(200).send({
                    animal: animalFromDb
                });
            }
        }
    });
}

function updateAnimal(req, res) {
    var animalId = req.params.id;
    var update = req.body;

    animal.findByIdAndUpdate(animalId, update, {new: true}).populate({ path: 'user' }).exec((err, animalUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'No se ha podido realizar la actualización del animal'
            });
        } else {
            if (!animalUpdated) {
                res.status(404).send({
                    message: 'No se ha encontrado el animal'
                });
            } else {
                res.status(200).send({
                    animal: animalUpdated
                });
            }
        }
    });
}

module.exports = {
    pruebas,
    saveAnimal,
    getAnimals,
    getAnimal,
    updateAnimal
};