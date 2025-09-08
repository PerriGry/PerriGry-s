import pool from "@/lib/db";

export async function GET() {
    try {
        const { rows } = await pool.query(
            "SELECT id_metodo, nombre FROM metodos_pago ORDER BY id_metodo ASC;"
        );
        return new Response(JSON.stringify(rows), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
