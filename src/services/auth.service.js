import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";


//Servicio de Hash, Con el Objetivo de Cifrar al PassWord
export const Hashed = async(password)=>{
    return await bcrypt.hash(password, 8)
}

//Servicio de 'Comparar' Las Passwords
//psw --> Password Ingresada || pswdb --> Password de la DataBase
//Proceso: Cifra psw y luego la comparar con pswdb que ya está cifrada
export const ComparePsw = async(psw, pswdb)=>{
    return await bcrypt.compare(psw, pswdb);
}

//Servicio de Registrar Empleados
export const SignUp = async(nombre, email, pwd, rol)=>{
    const result = await pool.query(
        'INSERT INTO USUARIOS(nombre, email, pwd, rol) VALUES($1,$2,$3,$4);',
        [nombre, email, pwd, rol]
    );
    return result.rows[0];
}

//Servicio de Buscar Email
export const FindEmail = async(email)=>{
    const result = await pool.query(
        'SELECT * FROM f_login($1);',
        [email]
    );
    return result.rows[0];
}

//Servicio de Creación del Token 
//Recomendación: Las llaves deben usar los nombres correspondientes de las columnas de la db
export const GenerateToken = (user)=>{
    return jwt.sign({
        id_usuario: user.id_usuario, 
        role: user.rol,
    },
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRES_IN});   
}

//Servicio Verificacion y Decodificacion Token
export const VerifyToken = (token)=>{
    try { 
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) { return null; }
}

//Servicio de Creacion Token Init
//Objetivo -> Creacion de Token temporal que guarde el correo y así, saber su vectores faciales
export const GenerateInitToken = (user) => {
    return jwt.sign({
        email : user.email
    },
    process.env.JWT_SECRET_INIT,
    {expiresIn:process.env.JWT_EXPIRES_INIT});
}

//Servicio de Verificacion y Decodificacion del Token Init
export const VerifyInitToken = (token) =>{
    try {
        return jwt.verify(token, process.env.JWT_SECRET_INIT)
    } catch (error) {return null;}
}