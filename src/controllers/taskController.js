import { MongoClient } from 'mongodb';

// Función para obtener todas las tareas
export async function getAllTasks(db) {
  const tasksCollection = db.collection('tasks');
  return await tasksCollection.find({}).toArray();
}

// Función para crear una nueva tarea
export async function createTask(db, taskData) {
  const tasksCollection = db.collection('tasks');
  const newTask = {
    ...taskData,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  };

  try {
    const result = await tasksCollection.insertOne(newTask);
    // Usar result.insertedId para obtener el ID de la tarea insertada
    return {
      ...newTask,
      _id: result.insertedId,
    };
  } catch (error) {
    console.error('Error creando la tarea:', error);
    throw new Error('Error creando la tarea');
  }
}

// Función para crear múltiples tareas en bulk
export async function createTasksInBulk(db, tasksData) {
  const tasksCollection = db.collection('tasks');
  const newTasks = tasksData.map(taskData => ({
    ...taskData,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  }));

  try {
    const result = await tasksCollection.insertMany(newTasks);
    return result.insertedIds;
  } catch (error) {
    console.error('Error creando tareas en bulk:', error);
    throw new Error('Error creando tareas en bulk');
  }
}

// Función para actualizar una tarea existente
export async function updateTask(db, id, updateData) {
  const tasksCollection = db.collection('tasks');
  const result = await tasksCollection.findOneAndUpdate(
    { _id: new MongoClient.ObjectId(id) },
    {
      $set: {
        ...updateData,
        actualizadoEn: new Date()
      }
    },
    { returnOriginal: false }
  );
  return result.value;
}

// Función para eliminar una tarea
export async function deleteTask(db, id) {
  const tasksCollection = db.collection('tasks');
  await tasksCollection.deleteOne({ _id: new MongoClient.ObjectId(id) });
}
