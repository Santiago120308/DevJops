import admin from 'firebase-admin';
import fs from 'fs';
import {Postulaciones, PostulacionesVacantes} from '../Models/index.js'

const serviceAccountPath = 'C:\\Users\\chris\\Torre-Node-proyectos\\DevJops\\Backend\\serviceAccountKey\\devjops-d2d32-firebase-adminsdk-2w7h6-09cefa47a6.json';
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://devjops-d2d32.appspot.com' // Reemplaza con tu bucket de Firebase Storage
});

const bucket = admin.storage().bucket();

const agregarPostulacion = async (req, res) => {

    const {id} = req.params;
    const {name , email} = req.body;


    if (!req.file) {
        return res.status(400).json({msg : 'El archivo es obligatorio.'});
    }

   if(!req.usuario){
       const error = new Error('Inicia  sesion para poder postularte')
       return res.status(400).json({msg : error.message});
   }

    const localFilePath = req.file.path; // Ruta del archivo temporal creado por Multer
    const originalFileName = req.file.filename; // Nombre original del archivo

    const storageFilePath = `uploads/${originalFileName}`; // Ruta en Firebase Storage

    try {
       const fileUrlResponse = await bucket.upload(localFilePath, {
            destination: storageFilePath,
            metadata: {
                contentType: req.file.mimetype
            }
        });

        // Elimina el archivo local después de subirlo a Firebase Storage
        console.log(localFilePath)
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo:', err);
            } else {
                console.log('Archivo eliminado exitosamente:', localFilePath);
            }
        });


        const [file] = await fileUrlResponse;
        const [url] = await file.getSignedUrl({
            action : 'read' ,
            expires : '01-01-2500'
        })

        // creamos la relacion en la base de datos

        const postulacion =  await Postulaciones.create({
            curriculum : url,
            nombre : name ,
            email : email,
        })

        await PostulacionesVacantes.create({
            postulacionId : postulacion.id ,
            vacanteId : id ,
        })

        res.status(200).json({msg : 'Te postulaste con exito a la vacante , espera mas informacion por email'});
    } catch (e) {
        console.error(e);
        res.status(500).json({msg : 'Error al subir el archivo , intentelo de nuevo'});
    }
};

export {
    agregarPostulacion,
};