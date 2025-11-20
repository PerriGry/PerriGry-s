import { updateEmployee } from "@/services/auth.service";

//Actualizar Empleado
export async function PUT(req){
    try {
        const body = await req.json();
        //Parametros A Necesaitar
        const {email, name, rol} = body;
        //Servicio UPDATE de Empleado
        await updateEmployee(email, name, rol);
        //Respuesta
        return new Response(
            JSON.stringify({message:"Usuario Actualizado Correctamente"}),
            {status:201}
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error:error.message}),
            {status: 500}
        );
    }
}