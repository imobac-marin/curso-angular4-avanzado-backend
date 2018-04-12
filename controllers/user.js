'use strict'
// modulos
var bcrypt = require('bcrypt-nodejs');

// modelos
var user = require('../models/user');

// servicio JWT
var jwt = require('../services/jwt');

// acciones
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de usuario y la acción pruebas'
    });
}

function saveUser(req, res) {
    //Crear el objeto del usuario
    var usuario = new user();
    //Recoger el body de la petición
    var params = req.body;

    if (params.password && params.name && params.surname && params.email) {
        //Asignar valores al usuario
        usuario.name = params.name;
        usuario.surname = params.surname;
        usuario.email = params.email;
        usuario.role = params.role;
        usuario.image = null;

        user.findOne({
            email: usuario.email.toLowerCase()
        }, (err, user) => {
            if (err) {
                res.status(500).send({
                    message: 'Error al comprobar el usuario'
                });
            } else {
                if (!user) {
                    //Cifrar contraseña
                    bcrypt.hash(params.password, null, null, function (err, hash) {
                        usuario.password = hash;
                        //Guardar usuario en la bd
                        usuario.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({
                                    message: 'Error al guardar el usuario'
                                });
                            } else {
                                if (!userStored) {
                                    res.status(404).send({
                                        message: 'No se ha registrado el usuario para poder registrar el usuario'
                                    });
                                } else {
                                    res.status(200).send({
                                        usuario: userStored
                                    });
                                }
                            }
                        });
                    });
                } else {
                    res.status(200).send({
                        message: 'El usuario no puede registrarse'
                    });
                }
            }
        });
    } else {
        res.status(200).send({
            message: 'Introduce los datos correctamente'
        });
    }
}

function login(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    user.findOne({
        email: email.toLowerCase()
    }, (err, isUser) => {
        if (err) {
            res.status(500).send({
                message: 'Error al comprobar el usuario'
            });
        } else {
            if (isUser) {
                bcrypt.compare(password, isUser.password, (err, check) => {
                    if (check) {
                        // Comprobar y generar token
                        if(params.getToken){
                            //devolver token jwt
                            res.status(200).send({
                                token: jwt.createToken(isUser)
                            });
                        }else{
                            res.status(200).send({
                                isUser
                            });
                        }
                    } else {
                        res.status(404).send({
                            message: 'El usuario no ha podido loguearse correctamente'
                        });
                    }
                });
            } else {
                res.status(404).send({
                    message: 'El usuario no ha podido loguearse'
                });
            }

        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    login
};