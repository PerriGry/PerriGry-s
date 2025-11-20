import { deleteProduct } from "@/services/product.service";
import { VerifyToken } from "@/services/auth.service";
import { cookies } from "next/headers";

//ELIMINAR Producto
export async function POST(req){
    try {
        const body = await req.json();
        //Parametros A Necesaitar
        const {id} = body;
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
        //Servicio DELETE de Prodcuto
        await deleteProduct(id);
        //Respuesta
        return new Response(
            JSON.stringify({message:"Producto Actualizado Correctamente"}),
            {status:201}
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error:error.message}),
            {status: 500}
        );
    }
}