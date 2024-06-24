import {Contratos} from '../Models/index.js'

const listarTipoContrato = async (req , res) => {

    const contratos = await Contratos.findAll();
    return res.status(200).json(contratos);
}


export {
    listarTipoContrato
}