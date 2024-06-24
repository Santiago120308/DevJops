import jwt from 'jsonwebtoken'
import {Usuarios} from '../Models/index.js'

const checkAuth =  async (req , res , next) => {
    let token;

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token , process.env.JWT_SECRET);

            req.usuario = await Usuarios.findByPk(decoded.id, {
                attributes: {
                    exclude: ['password', '__v']
                }
            });

            return next();
        } catch (error) {
            return res.status(404).json({msg : `Hubo un error : ${error.message}` })
        }
    }

    if(!token) {
        const error = new Error("Token no valido")
        return  res.status(401).json({msg : error.message})
    }
}

export default checkAuth;