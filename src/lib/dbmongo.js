import { MongoClient } from "mongodb";
//Declarar Opciones
const options = {};
//Crear Conexion
const client = new MongoClient(process.env.MONGODB_URI, options);
//Crear Cliente con capacidad de realizar promesas
const clientPromise = client.connect();
//Exportar Cliente
export default clientPromise;
