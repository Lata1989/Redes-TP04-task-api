import { MongoClient, ObjectId } from 'mongodb';

// Función para verificar si el ID es válido
function isValidObjectId(id) {
    return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

// Función para obtener una tarea por su ID
export async function getTaskById(db, id) {
    if (!isValidObjectId(id)) {
        throw new Error('ID inválido');
    }

    try {
        const task = await db.collection('tasks').findOne({ _id: new ObjectId(id) });
        return task;
    } catch (error) {
        console.error('Error obteniendo la tarea:', error);
        throw new Error('Error obteniendo la tarea');
    }
}
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

// Actualizar una tarea y devolver la tarea actualizada
export async function updateTask(db, id, updateData) {
    // Primero actualizamos la tarea
    await db.collection('tasks').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, actualizadoEn: new Date() } }
    );

    // Después obtenemos la tarea actualizada
    const updatedTask = await db.collection('tasks').findOne({ _id: new ObjectId(id) });
    return updatedTask; // Devolvemos la tarea actualizada
}

// Función para eliminar una tarea
export async function deleteTask(db, id) {
    try {
        const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return { success: false, message: 'No se encontró ninguna tarea para eliminar' };
        }
        return { success: true, message: 'Tarea eliminada con éxito' };
    } catch (error) {
        console.error('Error eliminando la tarea:', error);
        throw new Error('Error eliminando la tarea');
    }
}