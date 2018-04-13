'use strict'

var express = require('express');
var userController = require('../controllers/user');

var api = express.Router();
var mdwAuth = require('../middlewares/authenticated');

api.get('/pruebas-del-controlador', mdwAuth.ensureAuth, userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/login', userController.login);
api.put('/update-user/:id',mdwAuth.ensureAuth, userController.updateUser);

module.exports = api;