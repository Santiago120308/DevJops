import {DataTypes} from 'sequelize';
import db from '../Config/db.js'

const Contratos = db.define('contratos', {
    nombre : {
        type: DataTypes.STRING,
        allowNull : false
    } ,

} , {
    timestamps : false
} )

export  default  Contratos;