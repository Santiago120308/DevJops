import {DataTypes} from "sequelize";
import db from '../Config/db.js'

const Postulaciones = db.define('postulaciones', {
    curriculum: {
        type: DataTypes.STRING(1000), // Almacenaremos la URL del currículum
        allowNull: false,
    },
    nombre : {
        type: DataTypes.STRING(255),
        allowNull: false
    }
    ,
    email : {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
});

// Definir relaciones


export default  Postulaciones;
