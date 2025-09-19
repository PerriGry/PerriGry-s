import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; 
const options = {};


// Cliente global único
const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default clientPromise;
