const express = require('express');
//bcrypt una de las funciones sirve para encriptar contrasenas
const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const { verificaToken } = require('../middlewares/autenticacion');
const { verificaAdmin_Role } = require('../middlewares/autenticacion');
const { json } = require('body-parser');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {



    let desde = req.query.desde || 0;
    //se convierte a number porque req.query.desde es un String
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    //res.json('get Usuario LOCAL!!');
    Usuario.find({}, 'nombre email role estado google img')
        .skip(desde) //para que se salte y empiece despues de los 5
        .limit(limite) //para que se separe de 5 en 5 
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })


        })

});

app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        //bcrypt.hashSync sirve para aplicar la funcion y encriptar la contrasena con 10 vueltas 
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password =null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'el nombre es necesario'
    //     });

    // } else {
    //     res.json({
    //         persona: body
    //     });
    // }


});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    //el valor de id de add.put es igual al valor del id de req.params
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    //dentro de los parametros "body" sirve para mandar como respuesta el body (nombre,password,etc.)
    // new:true sirve para mandar el body que se ha actualizado mas no el anterior.
    //runvalidators sirve para validar por ej. en este caso los roles solo pueden ser 'ADMIN_ROLE', 'USER_ROLE', si el usuario escribe cualquier otra cosa no podra ser agregado
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };

    let cambiaEstado = {
        estado: false,
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            // usuario: usuarioBorrado
            usuario: usuarioBorrado
        });
    });


});


module.exports = app;