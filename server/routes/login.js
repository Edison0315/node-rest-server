const express = require('express')

const bcrypt  = require('bcrypt')

const Usuario = require('../models/usuario')

const app = express()

app.post('/login', (req, res) => {

    if(err){
        return res.status(400).json({
            ok: false,
            err
        });
    }

})


module.exports = app;
