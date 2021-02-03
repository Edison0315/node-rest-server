const express = require('express')

const bcrypt  = require('bcrypt')
const jwt     = require('jsonwebtoken')

const Usuario = require('../models/usuario')

const app = express()

app.post('/login', (req, res) => {

    let body = req.body;

    // Validar si los campos vienen como los necesito
    if(!body.email || !body.password){
        return res.status(500).json({
            ok: false,
            err: {
                message: "Parametros incorrectos en la peticion",
                estructura: {
                    tipo: "JSON",
                    body: {
                        email: "valor",
                        password: "valor"
                    }
                }
            }
        });
    }

    const user_pass_wrong = "Usuario o password incorrectos"; 

    Usuario.findOne({email:body.email}, (err, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: user_pass_wrong
                }
            });
        }
        
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: user_pass_wrong
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN})

        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        });

    })


})


module.exports = app;
