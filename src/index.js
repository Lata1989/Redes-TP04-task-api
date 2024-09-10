import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

app.use(express.json()); // Middleware para parsear JSON

// Conectar a MongoDB y luego iniciar el servidor
MongoClient.connect(MONGO_URI)
  .then((client) => {
    const db = client.db(DB_NAME);
    console.log('Conectado a la base de datos MongoDB');
    
    // Registrar las rutas
    app.use('/tasks', taskRoutes(db));

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error('Error conectando a MongoDB:', error));
