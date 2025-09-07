import pool from "@/lib/db";

// GET: listar usuarios
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST: crear usuario
export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    const result = await pool.query(
      "SELECT * FROM f_login($1);",
      [email]
    );

    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
