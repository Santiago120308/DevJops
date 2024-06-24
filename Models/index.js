import Vacantes from "./Vacantes.js";
import Habilidades from "./Habilidades.js";
import Contratos from "./Contrato.js";
import HabilidadVacante from "./HabilidadVacante.js";
import ContratoVacante from "./ContratoVacante.js";
import UsuarioVacante from "./UsuarioVacante.js";
import Usuarios from "./Usuarios.js";
import Postulaciones from "./Postulaciones.js";
import PostulacionesVacantes from "./PostulacionesVacantes.js";


// Define las relaciones entre las entidades
Vacantes.belongsToMany(Habilidades, { through: HabilidadVacante, foreignKey: 'vacanteId' });
Habilidades.belongsToMany(Vacantes, { through: HabilidadVacante, foreignKey: 'habilidadId' });

Vacantes.belongsToMany(Contratos, { through:  ContratoVacante, foreignKey: 'vacanteId' });
Contratos.belongsToMany(Vacantes , {through: ContratoVacante, foreignKey: 'contratoId'});

Vacantes.belongsToMany(Usuarios , {through: UsuarioVacante , foreignKey : 'vacanteId'});
Usuarios.belongsToMany(Vacantes , {through: UsuarioVacante , foreignKey : 'usuarioId'});


Vacantes.belongsToMany(Postulaciones , {through : PostulacionesVacantes , foreignKey : 'vacanteId'})
Postulaciones.belongsToMany(Vacantes , {through : PostulacionesVacantes , foreignKey : 'postulacionId'})

export {
    Vacantes,
    Habilidades,
    Contratos ,
    HabilidadVacante ,
    ContratoVacante ,
    Usuarios ,
    UsuarioVacante ,
    Postulaciones ,
    PostulacionesVacantes
}
