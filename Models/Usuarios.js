import {DataTypes} from 'sequelize';
import db from '../Config/db.js'
import bcrypt from 'bcrypt';
const Usuarios = db.define('usuarios', {

    nombre : {
        type: DataTypes.STRING,
        allowNull: false,
    } ,

    email : {
        type: DataTypes.STRING,
        allowNull: false ,
    } ,

    password : {
        type: DataTypes.STRING,
        allowNull: false ,
    } ,

    imagen : {
        type: DataTypes.STRING ,
        allowNull: false ,
    }

} , {
    timestamps : false ,
        hooks: {
            beforeCreate: async (usuario) => {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }
});


Usuarios.prototype.comprobarPassword = function (password) {
    return bcrypt.compareSync(password , this.password);
}

export default Usuarios