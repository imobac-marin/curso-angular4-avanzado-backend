'use strict'
// modulos
var bcrypt = require('bcrypt-nodejs');

// modelos
var user = require('../models/user');

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
            message: 'Introduce los datos correctamente'
        });
    }
}

module.exports = {
    pruebas,
    saveUser
};