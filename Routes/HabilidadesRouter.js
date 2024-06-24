import express from "express";
import {listarHabilidades} from "../Controllers/HabilidadesContoller.js";

const routerHabilidades = express.Router();

routerHabilidades.get('/listar-habilidades' , listarHabilidades )



export default routerHabilidades;
