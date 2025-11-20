import { top_products } from "@/services/work_functions.service";
import { VerifyToken, VerifyInitToken } from "@/services/auth.service";
import { cookies } from "next/headers";

export async function GET() {
    try {
        //Obtener Token
        const token = (await cookies()).get("access_token")?.value;
        //Servicio de Verificar Token
        const User = VerifyToken(token);
        //Verificar Estado Token
        if(!User) {
            return new Response(
                JSON.stringify({ error: "Token inválido o expirado" }),
                { status: 403 }
            );
        }
        //Servicio de Visualizar Productos vendidos
        const result = await top_products();
        //Respuesta
        return new Response(
            JSON.stringify(result),
            {status:200}
        )
    } catch (error) {
        return new Response(
            JSON.stringify({error:error.message}),
            {status:500}
        )
    }
}