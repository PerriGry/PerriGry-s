import { MongoFaceReturn } from "@/services/mongo.service";
import { VerifyInitToken } from "@/services/auth.service";
import { cookies } from "next/headers";

//Objetivo -> Retornar Vectores del Rostro según Email, para ser comparados en el Frontend
export async function POST(req) {
    try {
        //Obtener El Email gracias a la cookie
        const init_token = (await cookies()).get("init_token")?.value;
        //Servicio de Verificar Token
        const User = VerifyInitToken(init_token);
        //Verificar Estado Token
        if(!User) {
            return new Response(
                JSON.stringify({ error: "Token inválido o expirado" }),
                { status: 403 }
            );
        }
        //Segun El Email, se retornará el rostro Correspondiente
        const result = await MongoFaceReturn(User.email);
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