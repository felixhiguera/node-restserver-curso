const jwt = require('jsonwebtoken');

//===================
// Verificar token
//===================
//esta funcion ocupa como parametros req, res and next
let verificaToken = (req, res, next) => {
    //con req.get puede mandar a llamar el token que se hace llamar desde el frontend u otros valores, en este caso token
    let token = req.get('token');
    //recibe el token recibe el seed desde el config.js y tiene como patrones err and decoded ademas que jwt.verifica si es correcto
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        //si no es correcto manda error
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }
        //si es correcto decodifica el token en la variable decoded y lo pasa a req.usuario
        req.usuario = decoded.usuario;
        next();

    })
};
//===================
// Verificar AdminRole
//===================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role != 'ADMIN_ROLE') {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    } else {
        next();
    }

};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}