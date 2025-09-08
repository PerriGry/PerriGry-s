import pool from "@/lib/db";

export async function POST(req) {
    try {
        const { id_producto, cantidad } = await req.json();

        const pid = parseInt(id_producto, 10);
        const qty = parseInt(cantidad, 10);

        if (!pid || !qty || qty <= 0) {
            return new Response(
                JSON.stringify({ ok: false, error: "PARAMS_INVALID" }),
                { status: 400 }
            );
        }

        const { rows } = await pool.query(
            "SELECT id_producto, nombre, stock FROM productos WHERE id_producto = $1",
            [pid]
        );

        if (rows.length === 0) {
            return new Response(
                JSON.stringify({ ok: false, error: "PRODUCT_NOT_FOUND" }),
                { status: 404 }
            );
        }

        const prod = rows[0];
        const stock = Number(prod.stock);

        if (stock < qty) {
            return new Response(
                JSON.stringify({
                    ok: false,
                    error: "INSUFFICIENT_STOCK",
                    stock,
                    nombre: prod.nombre,
                }),
                { status: 409 }
            );
        }

        return new Response(
            JSON.stringify({
                ok: true,
                id_producto: Number(prod.id_producto),
                nombre: prod.nombre,
                stock,
            }),
            { status: 200 }
        );
    } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), {
            status: 500,
        });
    }
}
