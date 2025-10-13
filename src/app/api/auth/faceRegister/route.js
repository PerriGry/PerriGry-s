import { MongoFaceRegister, FindMongoEmail } from "@/services/mongo.service";
import { FindEmail } from "@/services/auth.service";
//Objetivo -> Registrar Los Rostros, Email y Rol en MongoDB
export async function POST(req) {
    try {
        const body = await req.json();
        //Datos a Requerir
        const {email, rol, descriptor} = body;
        //Llamado al Servicio de Busqueda de Email
        const UserMongo = await FindMongoEmail(email)
        //Sí User es diferente de Null, es porque el correo ya está registrado en MongoDB
        if(UserMongo) return new Response(JSON.stringify({message:"Email Ya Registrado En Mongo"}),{status:401})
        try {
            //Asegurar que el Email exista en la base de datos de Postgres (Mantener Congruencia de Datos)
            const user = await FindEmail(email)
            //Validar Rol del Email (Debe Ser coincidente con su contraparte de Postgres)
            if(rol != user.rol) return new Response(JSON.stringify({message:"Rol En Postgres No Coincidente"}),{status:401})
        } catch (error) {
            return new Response(JSON.stringify({message:"Emailen Postgres No Coincidente"}),{status:401})
        }
        //Llamado del Servicio de Registrar Rostros
        const result = await MongoFaceRegister(email, rol, descriptor);
        //Retornar Respuesta
        return new Response(
            JSON.stringify({message:result}),
            {status:201}
        );
    } catch (error) {
        return new Response(
            JSON.stringify({error:error.message}),
            {status:500}
        );
    }
}