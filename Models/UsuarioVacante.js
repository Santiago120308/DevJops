// intermedia.js
import { DataTypes } from 'sequelize';
import db from '../Config/db.js'; // Asegúrate de tener configurada la conexión a tu base de datos

const UsuarioVacante = db.define('usuario_vacantes', {
    // Define los campos de la tabla intermedia aquí, como los IDs de la vacante y la habilidad
    vacanteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default UsuarioVacante;