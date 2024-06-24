import {Habilidades} from '../Models/index.js'

const listarHabilidades = async (req , res) => {

    const habilidades = await Habilidades.findAll();
    return res.status(200).json(habilidades);
}


export {
    listarHabilidades
}