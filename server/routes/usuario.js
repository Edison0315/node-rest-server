const express = require('express')

const bcrypt  = require('bcrypt')
const _       = require('underscore')

const Usuario = require('../models/usuario')

const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion')

const app = express()

app.get('/usuarios', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde)
    
    let limite = req.query.limite || 5;
    limite = Number(limite)
    
    Usuario.find({estado: true}, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {

                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                // La condicion que recibe el count es la misma condicion del find
                Usuario.count({estado: true}, (err, conteo) => {

                    res.json({
                        ok: true,
                        usuarios,
                        conteo
                    })

                })

            })

})

app.post('/usuario', verificaToken, (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

})

// Capturar el ID
app.put('/usuario/:id', [verificaToken, verificaAdminRol], (req, res) => {
  
    let id   = req.params.id 
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    /*
     * -- Params --
     * @id       => id del registro
     * @body     => cuerpo de la peticion
     * @obj      => options para devolver el usr modificado, y correr las validaciones del schema
     * @callback => devuelve el error o el usuario de la DB
    */
    Usuario.findByIdAndUpdate(id, body, {new :true, runValidators: true}, (err, usuarioDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
})

app.delete('/usuario/:id', [verificaToken, verificaAdminRol], (req, res) => {
    
    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })


    })

})

app.delete('/inactivar/:id', [verificaToken, verificaAdminRol], (req, res) => {
    
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, {estado: false}, (err, usuarioDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
})

module.exports = app;