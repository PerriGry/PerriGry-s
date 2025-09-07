import bcrypt from "bcryptjs";
import pool from "@/lib/db";


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
    const [result] = await pool.query(
        'SELECT * FROM f_login($1);',
        [email]
    );
    return result;
}