import pool from "@/lib/db";

// LOGIN
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
