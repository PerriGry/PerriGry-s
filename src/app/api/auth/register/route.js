import { Hashed, SignUp } from "@/services/auth.service";

// Registrar Empleado
export async function POST(req){
    try {
        const body = await req.json();
        //Parametros A Necesaitar
        const {nombre, email, pwd, rol} = body;
        //Servicio Hash Password
        const HashedPwd = await Hashed(pwd);
        //Servicio Registro de Empleado
        await SignUp(nombre, email, HashedPwd, rol);
        //Respuesta
        return new Response(
            JSON.stringify({message:"Empleado Registrado Correctamente"}),
            {status:201}
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error:error.message}),
            {status: 500}
        );
    }
}