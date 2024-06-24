import {
    Vacantes,
    ContratoVacante,
    HabilidadVacante ,
    UsuarioVacante ,
    Contratos ,
    Habilidades ,
    Usuarios ,
    Postulaciones ,
    PostulacionesVacantes ,

} from '../Models/index.js'

import {Op} from 'sequelize'
import db from "../Config/db.js";

const agregarVacante = async (req , res) => {

    const data = req.body;

    const t = await db.transaction();
    try {
        //creamos vacante
        const vacante = await Vacantes.create({
            titulo: data.titulo,
            empresa : data.empresa ,
            ubicacion : data.ubicacion,
            salario : data.salario,
            descripcion : data.descripcion,
        } , {transaction : t})

        //creamos relacion con el contrato

        await ContratoVacante.create({
            vacanteId : vacante.id ,
            contratoId : data.contrato,
        } , {transaction : t})

        //creamos la relacion con las habilidades

        for (const habilidad of data.habilidades) {
            await HabilidadVacante.create({
                vacanteId : vacante.id ,
                habilidadId : habilidad.id
            } , {transaction : t})
        }

        //creamos la relacion con el usuario que creo la vacante

        await UsuarioVacante.create({
            vacanteId : vacante.id ,
            usuarioId : req.usuario.id
        } , {transaction : t})

        //comit de la transaccion

        await t.commit();

        console.log('vacante y relaciones creadas correctamente')
        res.status(201).json({ message: 'Vacante y relaciones creadas correctamente' });
    }catch (e) {
        await t.rollback();
        console.error(e)
        res.status(500).json({ message: 'Error al crear la vacante y relaciones', error: e.message });
    }

}

const listarVacntes  = async (req , res) => {

    const vacantes = await Vacantes.findAll({
        include : {
            model : Contratos ,
            through: {
                attributes: []  // Esto excluye los atributos de la tabla intermedia
            },

        }
    });

    return res.status(200).json(vacantes);

}

const listarVacante = async (req , res) => {
    const {id} = req.params;

    if(!id) return res.status(400).send('El id es obligatorio');

    try {
        const vacante = await Vacantes.findByPk(id , {
            include : [
                {
                    model : Contratos ,
                    through : {
                        attributes : []
                    }
                } ,
                {
                    model : Habilidades ,
                    through : {
                        attributes : []
                    }
                } ,
                {
                    model: Usuarios,
                    attributes : {exclude : ['password']} ,
                    through: {
                        model: UsuarioVacante, // Especifica la tabla intermedia que quieres incluir
                        attributes: [] // Puedes excluir atributos de la tabla intermedia si es necesario
                    }
                }
            ]
        })

        if(!vacante) return res.status(404).json({ message: 'La vacante no existe' });

        return res.status(200).json(vacante);
    }catch (e) {
        console.log(e)
    }

}

const listarVacantesPorUsuario = async (req , res) => {
    const {id} = req.params;

    if(!id) {
        const error = new Error('El id es obligatorio');
        return res.status(400).json({msg : error.message})
    }


    const usuarioConVacantes = await Usuarios.findByPk(id , {
        include : [

            {
                model : Vacantes ,
                through: {
                    model: UsuarioVacante, // Especifica la tabla intermedia que quieres incluir
                    attributes: []
                } ,
                include : [
                    {
                        model: Postulaciones,
                        through: {
                            model: PostulacionesVacantes, // Especifica la tabla intermedia que quieres incluir
                            attributes: []
                        }

                    } ,

                    {
                        model : Contratos ,
                        through : {
                            model: ContratoVacante, // Especifica la tabla intermedia que quieres incluir
                            attributes: []
                        }
                    } ,

                    {
                        model : Habilidades ,
                        through : {
                            model: HabilidadVacante, // Especifica la tabla intermedia que quieres incluir
                            attributes: []
                        }
                    }
                ]
            }
        ]
    });

    const error = new Error('El usuario no existe');
    if(!usuarioConVacantes) return res.status(404).json({ msg : error.message });


    return res.status(200).json(usuarioConVacantes);

}

const listarPostulaciones = async (req , res) => {
    const {id} = req.params;

    const error = new Error('El id es obligatorio');
    if(!id) return res.status(400).json({msg : error.message});

    const vacante = await Vacantes.findByPk(id, {
        include : [
            {
                model : Postulaciones,
                through: {
                    model: PostulacionesVacantes, // Especifica la tabla intermedia que quieres incluir
                    attributes: []
                }
            }
        ]
    })

    const e = new Error('La vacante no existe');
    if(!vacante) return res.status(404).json({ msg : error.message });

    return res.status(200).json(vacante);

}

const editarVacante = async (req , res) => {
    const data = req.body;
    const {id} = req.params;

    try {
        const vacante = await Vacantes.findByPk(id)

        const error = new Error('Hubo un error');
        if(!id || !vacante) return res.status(400).json({msg : error.message});

        const t = await db.transaction();

        try {
            vacante.titulo = data.titulo || vacante.titulo;
            vacante.empresa = data.empresa || vacante.empresa;
            vacante.ubicacion = data.ubicacion || vacante.ubicacion;
            vacante.salario = data.salario || vacante.salario;
            vacante.descripcion = data.descripcion || vacante.descripcion;

            await vacante.save({transaction : t});

            //actualizamos la relacion con el contrato

            await ContratoVacante.update({
                contratoId : data.contrato,
            } , {where : {vacanteId : id} , transaction : t})


            // Actualizar la relación con las habilidades
            // Primero, eliminamos las habilidades existentes
            await HabilidadVacante.destroy({ where: { vacanteId: id }, transaction : t });

            // Luego, agregamos las nuevas habilidades
            const habilidadVacanteData = data.habilidades.map(habilidad => ({
                vacanteId: id,
                habilidadId: habilidad.id
            }));
            await HabilidadVacante.bulkCreate(habilidadVacanteData, { transaction : t });

            await t.commit();

            return res.status(200).json({msg : 'Vacante editada con exito'})
        }catch (e) {
            await t.rollback();
            console.error('Error durante la transacción:', error);
            return res.status(500).json({ msg: 'Error eliminando la vacante' });
        }

    } catch (e) {
        console.log(e);
    }
}

const eliminarVacante = async (req, res) => {

    const { id } = req.params;

    try {
        // Verificar si el ID está presente
        if (!id) {
            return res.status(400).json({ msg: 'ID no proporcionado' });
        }

        // Buscar la vacante
        const vacante = await Vacantes.findByPk(id);
        if (!vacante) {
            return res.status(404).json({ msg: 'Vacante no encontrada' });
        }

        // Iniciar transacción
        const t = await db.transaction();

        try {
            // Eliminar las relaciones primero
            await ContratoVacante.destroy({ where: { vacanteId: id }, transaction: t });
            await HabilidadVacante.destroy({ where: { vacanteId: id }, transaction: t });
            await UsuarioVacante.destroy({ where: { vacanteId: id }, transaction: t });

            // Eliminar la vacante
            await Vacantes.destroy({ where: { id: id }, transaction: t });

            // Confirmar transacción
            await t.commit();

            return res.status(200).json({ msg: 'Vacante eliminada con éxito' });
        } catch (error) {
            // Revertir transacción en caso de error
            await t.rollback();
            console.error('Error durante la transacción:', error);
            return res.status(500).json({ msg: 'Error eliminando la vacante' });
        }
    } catch (error) {
        console.error('Error buscando la vacante:', error);
        return res.status(500).json({ msg: 'Error eliminando la vacante' });
    }
};

const VacantesFiltradas = async (req , res) => {
    const {textoFiltro} = req.body;

    const palabras = textoFiltro.split(' ');
    const condiciones = palabras.map(palabra => (
        {
            titulo : {
                [Op.like] : `%${palabra}%`
            }
        }
    ));

    const vacantes = await Vacantes.findAll({
        where: {
            [Op.or] : condiciones
        } , include : {
            model : Contratos ,
            through: {
                attributes: []  // Esto excluye los atributos de la tabla intermedia
            },
    }})

    return res.status(200).json(vacantes);
}


export {
    agregarVacante ,
    listarVacante ,
    listarVacntes ,
    listarVacantesPorUsuario ,
    listarPostulaciones ,
    editarVacante ,
    eliminarVacante ,
    VacantesFiltradas
}