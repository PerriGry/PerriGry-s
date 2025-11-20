import pool from "@/lib/db";


export const getProduct = async() => {
    const result = await pool.query(
        "SELECT * FROM PRODUCTOS;"
    );
    return result.rows
}

export const insertProduct = async(nombre, valor, cantidad) => {
    const result = await pool.query(
        `
        INSERT INTO PRODUCTOS
        (NOMBRE, VALOR_UNIDAD, STOCK)
        VALUES
        ($1,$2,$3);
        `,
        [nombre, valor, cantidad]
    );
    return result.rows[0]
}

export const updateProduct = async(id, nombre, valor, cantidad) => {
    const result = await pool.query(
        `
        UPDATE PRODUCTOS
        SET NOMBRE = ($1),
        VALOR_UNIDAD = ($2),
        STOCK = ($3)
        WHERE ID_PRODUCTO = ($4);
        `,
        [nombre, valor, cantidad, id]
    );
    return result.rows[0]
}

export const deleteProduct = async(id) => {
    const result = await pool.query(
        `
        DELETE FROM PRODUCTOS
        WHERE ID_PRODUCTO = ($1);
        `,
        [id]
    );
    return result.rows[0]
}