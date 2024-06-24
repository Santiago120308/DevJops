// intermedia.js
import { DataTypes } from 'sequelize';
import db from '../Config/db.js'; // Asegúrate de tener configurada la conexión a tu base de datos

const PostulacionesVacantes = db.define('postulaciones_vacantes', {
    // Define los campos de la tabla intermedia aquí, como los IDs de la vacante y la habilidad

    postulacionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    vacanteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

export default PostulacionesVacantes;