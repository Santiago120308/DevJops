import {DataTypes} from 'sequelize';
import db from '../Config/db.js'

const Habilidades = db.define('habilidades', {
    nombre : {
        type: DataTypes.STRING,
        allowNull : false
    } ,

} , {
    timestamps : false
} )

export  default  Habilidades;