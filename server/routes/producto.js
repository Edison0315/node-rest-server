const express = require('express')

const Producto = require('../models/producto')

const { verificaToken } = require('../middlewares/autenticacion')

const app = express()

// ================
// Buscar productos
// ================

app.get('/productos/buscar/:busqueda', (req, res) => {

    let busqueda = req.params.busqueda;

    /*
     * -- Params --
     * @busqueda   => la cadena que se capturo desde la URL
     * @i          => configuracion para que no sea sensible a mayusculas y minusculas
    */
    let regex = new RegExp(busqueda, 'i')

    /*
     * -- Params --
     * @OBJ   => Aca podremos poner un OBJ con propiedades del SCHEMA de 
     * la DB para hacer "where" dentro de la consulta principal
    */
    Producto.find({nombre: regex, disponible: true})
            .populate('categoria', 'nombre')
            .exec((err, productosDB) => {

        if(err){
            return res.status(400).json({
                ok: false, 
                err
            })
        }

        res.json({
            ok: true,
            productos: productosDB
        })

    })
})


app.get('/productos', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde)
    
    let limite = req.query.limite || 5;
    limite = Number(limite)

    Producto.find({disponible: true})
            .skip(desde)
            .limit(limite)
            .populate('categoria', 'nombre descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, productosDB) => {

        if(err){
            return res.status(400).json({
                ok: false, 
                err
            })
        }

        res.json({
            ok: true,
            productos: productosDB
        })

    })

})

app.post('/producto', (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: body.usuario
    })

    producto.save((err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false, 
                err
            })
        }

        if(!productoDB){
            ok: false, 
            err
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })

})

app.get('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.find({_id: id})
            .populate('categoria', 'nombre descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, productoDB) => {

        if(err){
            return res.status(400).json({
                ok: false, 
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })

})

app.put('/producto/:id', (req, res) => {
    
    let id = req.params.id;

    /*
     * -- Params --
     * @id       => id del registro
     * @body     => cuerpo de la peticion
     * @obj      => options para devolver el usr modificado, y correr las validaciones del schema
     * @callback => devuelve el error o el usuario de la DB
    */
    Producto.findByIdAndUpdate(id, req.body, {new: true, runValidators: true}, (err, productoDB) => {
    
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(400).json({
            ok: true,
            producto: productoDB
        });

    })

})

app.delete('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndRemove(id, (err, productoBorrado) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado
        })

    })

})

app.delete('/producto/inactivar/:id', (req, res) => {
    
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible: false}, (err, productoDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });


    })

})


module.exports = app
