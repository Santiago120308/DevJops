import express from "express";
import {
    agregarVacante,
    listarVacante,
    listarVacntes,
    listarVacantesPorUsuario,
    listarPostulaciones, editarVacante, eliminarVacante, VacantesFiltradas
} from "../Controllers/VacanteController.js";
import checkAuth from "../middleware/checkAuth.js";

const VacantesRouter = express.Router();

VacantesRouter.post('/agregar-vacante' , checkAuth ,  agregarVacante );
VacantesRouter.get('/listar-vacante/:id' , listarVacante);
VacantesRouter.get('/listar-vacantes' , listarVacntes );
VacantesRouter.get('/listar-vacantes-por-usuario/:id' , checkAuth ,  listarVacantesPorUsuario );
VacantesRouter.get('/listar-postulaciones/:id' , checkAuth ,  listarPostulaciones );
VacantesRouter.post('/editar-vacante/:id' , checkAuth , editarVacante );
VacantesRouter.delete('/eliminar-vacante/:id' , checkAuth , eliminarVacante );
VacantesRouter.post('/filtrar-vacantes' , VacantesFiltradas)

export default VacantesRouter;
