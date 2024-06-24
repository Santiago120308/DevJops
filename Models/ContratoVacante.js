// intermedia.js
import { DataTypes } from 'sequelize';
import db from '../Config/db.js'; // Asegúrate de tener configurada la conexión a tu base de datos

const ContratoVacante = db.define('contrato_vacante', {
    // Define los campos de la tabla intermedia aquí, como los IDs de la vacante y la habilidad
    vacanteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    contratoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default ContratoVacante;
