import {DataTypes} from 'sequelize';
import db from '../Config/db.js'

const Vacantes = db.define('vacantes', {

    titulo : {
        type: DataTypes.STRING,
        allowNull: false,
    } ,

    empresa : {
        type: DataTypes.STRING,
        allowNull: false ,
    } ,

    ubicacion : {
        type: DataTypes.STRING,
        allowNull: false ,
    } ,

    salario : {
        type: DataTypes.STRING,
        allowNull: false ,
    } ,

    descripcion : {
        type: DataTypes.STRING,
        allowNull: false ,
    }
});

export default Vacantes