const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()

const Usuario = require('../models/usuario')

app.use(fileUpload({ useTempFiles: true }))

// =======================
// Ejemplos de las rutas
// =======================
// /upload/usuario/123456
// /upload/productos/123456
// =======================
app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id   = req.params.id;

    if(!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        })
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios']

    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
            }
        });
    }

    let archivo       = req.files.archivo;
    let nombreCortado = archivo.name.split('.')
    let extension     = nombreCortado[nombreCortado.length - 1]

    // Extensiones permitidas
    let extensionesValidas = ['jpg', 'jpeg']

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
            }
        });
    }

    // Cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`./uploads/${tipo}/${nombreArchivo}`, (err) => {
        
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        });
    })
})

module.exports = app;
