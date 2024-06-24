import express from 'express';
import db from './Config/db.js'
import HabilidadesRouter from "./Routes/HabilidadesRouter.js";
import cors from 'cors'
import ContratoRouter from "./Routes/ContratoRouter.js";
import VacantesRouter from "./Routes/VacantesRouter.js";
import UsuariosRouter from "./Routes/UsuariosRouter.js";
import PostulacionesRouter from "./Routes/PostulacionesRouter.js";

const app = express();

app.use(express.json());

try {
    await db.authenticate();
    db.sync();
    console.log('conexion correcta a la base de datos')
} catch (error) {
    console.log(error)
}

const port = 5000;
app.listen(port);
console.log(`Servidor corriendo en el puerto ${port}`)

//cors


const whiteList = [process.env.FRONTED_URL , ];

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.includes(origin)) {
            //Puede consultar la api
            callback(null, true);
        } else {
            callback(new Error("Error de Cors"))//        }
        }
    }
}

app.use(cors(corsOptions))

app.use("/api/habilidades" , HabilidadesRouter)
app.use("/api/contratos" , ContratoRouter)
app.use("/api/vacantes" , VacantesRouter)
app.use("/api/usuarios" , UsuariosRouter)
app.use("/api/postulaciones" , PostulacionesRouter);
