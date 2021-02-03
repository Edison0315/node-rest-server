const jwt = require('jsonwebtoken')

// =====================
// Verificar token
// =====================

// El parametro next es para seguir con la ejecucion del programa
// cuando est
let verificaToken = (req, res, next) => {

    let token = req.get('Authorization')

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                ok: false,
                err
            });    
        }

        req.usuario = decoded.usuario;
        next()

    })

}

// =====================
// Verificar admin ROL
// =====================
let verificaAdminRol = (req, res, next) => {

    let usuario = req.usuario;

    if(usuario.role != "ADMIN_ROLE"){

        return res.status(401).json({
            ok: false,
            err: {
                message: "El usuario no es administrador"
            }
        });

    }   

    next();

}

module.exports = {
    verificaToken,
    verificaAdminRol
}