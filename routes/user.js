'use strict'

var express = require('express');
var userController = require('../controllers/user');

var api = express.Router();

api.get('/pruebas-del-controlador', userController.pruebas);

module.exports = api;