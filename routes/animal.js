'use strict'

var express = require('express');
var animalController = require('../controllers/animal');

var api = express.Router();
var mdwAuth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var mdwUpload = multipart({
    uploadDir: './uploads/animals'
});

api.get('/pruebas-animales', mdwAuth.ensureAuth, animalController.pruebas);
api.post('/animal', mdwAuth.ensureAuth, animalController.saveAnimal);

module.exports = api;