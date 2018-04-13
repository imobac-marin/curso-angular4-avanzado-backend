'use strict'

var express = require('express');
var userController = require('../controllers/user');

var api = express.Router();
var mdwAuth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var mdwUpload = multipart({
    uploadDir: './uploads/users'
});

api.get('/pruebas-del-controlador', mdwAuth.ensureAuth, userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/login', userController.login);
api.put('/update-user/:id', mdwAuth.ensureAuth, userController.updateUser);
api.post('/upload-image-user/:id', [mdwAuth.ensureAuth, mdwUpload], userController.uploadImage);
api.get('/get-image-file/:imageFile', userController.getImageFile);
api.get('/keepers', userController.getKeepers);

module.exports = api;