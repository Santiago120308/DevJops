import {Usuarios} from '../Models/index.js'
import {generarJWT} from "../Helpers/tokens.js";


const crearUsuario = async (req , res) => {

    const usuario = req.body;
    const {email} = usuario;

    const usuarioExiste = await Usuarios.findOne({ where: { email } });
    console.log(usuarioExiste)
    if(usuarioExiste){
        const error = new Error('Este correo ya fue registrado')
        return res.status(400).json({msg : error.message});
    }

    await Usuarios.create(usuario);

    return res.status(200).json({msg: 'Cuenta creada correctamente'});
}


const iniciarSesion = async (req , res) => {
    const {email , password} = req.body;

    const usuarioExiste = await Usuarios.findOne({ where: { email } });

    if(!usuarioExiste) {
        const error = new Error('Email o Password no validos');
        return res.status(404).json({msg : error.message});
    }

    if(!usuarioExiste.comprobarPassword(password)){
        const error = new Error('Email o Password no validos')
        return res.status(404).json({msg : error.message})
    }

    //autenticamos

    return res.status(200).json({
        token : generarJWT(usuarioExiste.id) ,
        id : usuarioExiste.id
    })
}


const buscarPorId = async (req, res) => {
    const { idUsuario } = req.params;

    console.log('entre')
    console.log(idUsuario)
    const usuario = await Usuarios.findByPk(idUsuario, {
        attributes: { exclude: ['password'] }
    });

    return res.status(200).json(usuario)
}



export {
    crearUsuario  ,
    iniciarSesion ,
    buscarPorId
}