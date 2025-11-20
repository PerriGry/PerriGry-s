import { deleteEmployee } from "@/services/auth.service";

export async function DELETE(req){
    try {
        const body = await req.json();
        //Parametros A Necesaitar
        const {email} = body;
        //Servicio UPDATE de Empleado
        await deleteEmployee(email);
        //Respuesta
        return new Response(
            JSON.stringify({message:"Usuario Eliminado Correctamente"}),
            {status:201}
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error:error.message}),
            {status: 500}
        );
    }
}