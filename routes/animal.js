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
api.get('/get-animals', animalController.getAnimals);
api.get('/get-animal/:id', animalController.getAnimal);
api.put('/update-animal/:id', mdwAuth.ensureAuth, animalController.updateAnimal);
api.post('/upload-image-animal/:id', [mdwAuth.ensureAuth, mdwUpload], animalController.uploadImage);
api.get('/get-image-animal-file/:imageFile', animalController.getImageFile);

module.exports = api;