import pool from "@/lib/db";

//Servicio de Registrar Venta
export const Register_Sale = async(id_usuario, cedula_cliente, id_metodo_pago, id_productos, cantidad)=>{
    const result = await pool.query(
        "CALL registrar_pedido($1,$2,$3,$4,$5);",
        [id_usuario, cedula_cliente, id_metodo_pago, id_productos, cantidad]
    );
    return result.rows[0];
}

//Servicio Ver Ventas Totales
export const ver_ventas = async() => {
    const result = await pool.query(
        "SELECT * FROM f_ventas_totales();"
    );
    return result.rows;
}

//Servicio Registro o Consulta de Clientes
export const register_client = async(cedula, email, nombre)=>{
    const result = await pool.query(
        "SELECT * FROM f_registrar_cliente($1,$2,$3);",
        [cedula, email, nombre]
    );
    return result.rows[0];
}