const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion')

let app = express()

let Categoria = require('../models/categoria')

app.get('/categorias', verificaToken, (req, res) => {
    
    Categoria.find({}).exec((err, categoriasDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias: categoriasDB
        })

    })

})

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.find({_id:id}).exec((err, categoriaDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

})

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });

    })
    
})

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    /*
     * -- Params --
     * @id       => id del registro
     * @body     => cuerpo de la peticion
     * @obj      => options para devolver el usr modificado, y correr las validaciones del schema
     * @callback => devuelve el error o el usuario de la DB
    */
   Categoria.findByIdAndUpdate(id, req.body, {new :true, runValidators: true}, (err, categoriaDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

})

app.delete('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriaBorrada){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            usuario: categoriaBorrada
        })

    })

})


app.delete('/categoria/inactivar/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    
    Categoria.findByIdAndUpdate(id, {estado: false}, (err, categoriaDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

})


module.exports = app;