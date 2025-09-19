import clientPromise from "@/lib/dbmongo";


//Servicio de Registro de Rostros
export const MongoFaceRegister = async (email, rol, descriptor) => {
    const client = await clientPromise;
    const db = client.db('MorriGry');
    const result = await db.collection('AuthUser').insertOne({
        email,
        rol,
        descriptor 
    });

    return result;
}

//Servicio Retornar Rostro Según Email
export const MongoFaceReturn = async (v_email) => {
    const client = await clientPromise;
    const db = client.db("MorriGry");

    //Buscar solo por email
    const user = await db.collection("AuthUser").findOne({ email: v_email });
    //Validar Si se ha encontrado un Usuario
    if (!user) throw new Error("Usuario no encontrado");
    
    return {
        descriptor: user.descriptor
    };
};
