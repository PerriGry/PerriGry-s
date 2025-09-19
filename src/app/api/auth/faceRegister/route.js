import { MongoFaceRegister } from "@/services/mongo.service";

//Objetivo -> Registrar Los Rostros, Email y Rol en MongoDB
export async function POST(req) {
    try {
        const body = await req.json();
        //Datos a Requerir
        const {email, rol, descriptor} = body;
        //Llamado del Servicio de Registrar Rostros
        const result = await MongoFaceRegister(email, rol, descriptor);
        //Retornar Respuesta
        return new Response(
            JSON.stringify({message:result}),
            {status:201}
        );
    } catch (error) {
        return new Response(
            JSON.stringify({error:error.message}),
            {status:500}
        );
    }
}