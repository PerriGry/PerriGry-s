import { MongoFaceReturn } from "@/services/mongo.service";

//Objetivo -> Retornar Vectores del Rostro según Email, para ser comparados en el Frontend
export async function POST(req) {
    try {
        const body = await req.json();
        //Se Requiere Email
        const {email} = body;
        //Segun El Email, se retornará el rostro Correspondiente
        const result = await MongoFaceReturn(email);
        //Retornar Respuesta
        return new Response(
            JSON.stringify(result),
            {status:201}
        );
    } catch (error) {
        return new Response(
            JSON.stringify({error:error.message}),
            {status:500}
        );
    }
    
}