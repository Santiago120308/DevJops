import express from "express";
import {listarTipoContrato} from "../Controllers/ContratoController.js";

const routerContratos = express.Router();

routerContratos.get('/listar-contratos' , listarTipoContrato )



export default routerContratos;
