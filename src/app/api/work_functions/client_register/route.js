import { register_client } from "@/services/work_functions.service";

export async function POST(req) {
    try {
        const body = await req.json();
        //Parametros Necesarios
        const {cedula, email} = body;
        //Servicio de Registrar Cliente
        const result = await register_client(cedula, email);
        //Respuesta
        return new Response(
            JSON.stringify(result), 
            {status:201}
        );
    } catch (error) {
        return new Response(
            JSON.stringify({error:error.message}),
            {status:500});
    }
    
}