import { Register_Sale } from "@/services/work_functions.service";
import { VerifyToken } from "@/services/auth.service";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const body = await req.json();
        //Parametros Requeridos
        const {cedula_cliente, id_metodo_pago, id_productos, cantidad} = body;
        //Obtener Cookie con el Token
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
        //Servicio de Registrar Venta
        await Register_Sale(User.id_usuario, cedula_cliente, id_metodo_pago, id_productos, cantidad);
        //Respuesta
        return new Response(
            JSON.stringify({message:"Registro Exitoso"}),
            {status:201}
        );
    } catch (error) {
        return new Response(
            JSON.stringify({error: error.message}),
            {status:500}
        );
    }
}