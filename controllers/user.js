'use strict'
// modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

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
                        if (params.getToken) {
                            //devolver token jwt
                            res.status(200).send({
                                token: jwt.createToken(isUser),
                                isUser
                            });
                        } else {
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

function updateUser(req, res) {

    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
        return res.status(500).send({
            message: 'No tienes permiso para actualizar el usuario'
        });
    }

    user.findByIdAndUpdate(userId, update, {
        new: true
    }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error al actualizar usuario'
            });
        } else {
            if (!userUpdated) {
                res.status(404).send({
                    message: 'No se ha podido actualizar el usuario'
                });
            } else {
                res.status(200).send({
                    user: userUpdated
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;

    if (req.files) {
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var existingFileName = fileSplit[2];
        var extensionFileSplit = existingFileName.split('.');
        var extensionFile = extensionFileSplit[1];

        if (extensionFile.toLowerCase() == 'png' || extensionFile.toLowerCase() == 'jpg' || extensionFile.toLowerCase() == 'jpeg' || extensionFile.toLowerCase() == 'gif') {
            user.findByIdAndUpdate(userId, {
                image: existingFileName
            }, {
                new: true
            }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({
                        message: 'Error al actualizar usuario'
                    });
                } else {
                    if (!userUpdated) {
                        res.status(404).send({
                            message: 'No se ha podido actualizar el usuario'
                        });
                    } else {
                        res.status(200).send({
                            user: userUpdated,
                            image: existingFileName
                        });
                    }
                }
            });
        } else {
            fs.unlink(filePath, (err) => {
                if (err) {
                    res.status(200).send({
                        message: 'Extension no válida y no se ha podido borrar el fichero'
                    });
                } else {
                    res.status(200).send({
                        message: 'Extension no válida'
                    });
                }
            });
        }
    } else {
        res.status(200).send({
            message: 'No se han subido ficheros'
        });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/' + imageFile;
    fs.exists(pathFile, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(404).send({
                message: 'No se encuentra la imagen'
            });
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getImageFile
};