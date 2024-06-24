import express from "express";
import {agregarPostulacion} from "../Controllers/PostulacionesController.js";
import multer from 'multer';
import sanitize from 'sanitize-filename';
import fs from 'fs';
import path from 'path';
import checkAuth from "../middleware/checkAuth.js";

const PostulacionesRouter = express.Router();

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizedOriginalName = sanitize(file.originalname);
        cb(null, uniqueSuffix + '-' + sanitizedOriginalName);
    },
});

const upload = multer({
    storage: storage, // Configuración de almacenamiento definida anteriormente
    limits: { fileSize: 1000000 }, // Límite de tamaño de 1MB
    fileFilter: (req, file, cb) => { // Filtro de archivos para aceptar solo PDFs
        const fileTypes = /pdf/; // Definición de tipos de archivo permitidos usando una expresión regular
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); // Verifica la extensión del archivo
        const mimetype = fileTypes.test(file.mimetype); // Verifica el tipo MIME del archivo

        if (mimetype && extname) {
            return cb(null, true); // Si el archivo es un PDF, permite la subida
        } else {
            cb(new Error('Only PDF files are allowed')); // Si no, rechaza la subida con un error
        }
    }
});


PostulacionesRouter.post('/agregar-postulacion/:id' , upload.single('file') , checkAuth  , agregarPostulacion )

export default PostulacionesRouter;

export {
    upload
}