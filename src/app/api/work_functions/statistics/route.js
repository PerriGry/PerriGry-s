import { ver_ventas } from "@/services/work_functions.service";
import { VerifyToken } from "@/services/auth.service";
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
        //Servicio de Visualizar Ventas Totales
        const result = await ver_ventas();
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