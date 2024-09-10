import express from 'express';
import { getAllTasks, createTask, updateTask, deleteTask, createTasksInBulk } from '../controllers/taskController.js';

const router = express.Router();

// Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const tasks = await getAllTasks(req.db);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo las tareas' });
  }
});

// Crear una nueva tarea
router.post('/', async (req, res) => {
  const { titulo, descripcion, estado } = req.body;
  try {
    const newTask = await createTask(req.db, { titulo, descripcion, estado });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Error creando la tarea' });
  }
});

// Crear múltiples tareas en bulk
router.post('/bulk', async (req, res) => {
  const tasksData = req.body;
  try {
    const insertedIds = await createTasksInBulk(req.db, tasksData);
    res.status(201).json({ insertedIds });
  } catch (error) {
    res.status(500).json({ error: 'Error creando las tareas en bulk' });
  }
});

// Actualizar una tarea
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedTask = await updateTask(req.db, id, updateData);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando la tarea' });
  }
});

// Eliminar una tarea
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteTask(req.db, id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando la tarea' });
  }
});

export default (db) => {
  const routerWithDb = express.Router();
  routerWithDb.use((req, res, next) => {
    req.db = db;
    next();
  });
  routerWithDb.use('/', router);
  return routerWithDb;
};
