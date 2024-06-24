import express from "express";
import {buscarPorId, crearUsuario, iniciarSesion} from "../Controllers/UsuariosController.js";

const UsuariosRouter = express.Router();

UsuariosRouter.post('/agregar-usuario' , crearUsuario )
UsuariosRouter.post('/iniciar-sesion' , iniciarSesion)
UsuariosRouter.get('/buscar-usuario/:idUsuario' , buscarPorId);

export default UsuariosRouter;

