import { FindEmail, ComparePsw, GenerateToken } from "@/services/auth.service";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { email, pwd } = await req.json();

    //Servicio de Buscar Email
    const user = await FindEmail(email);
    if (!user) {
      return new Response(JSON.stringify({ message: "Email no registrado" }), { status: 404 });
    }
    //Servicio de Comparar Password
    const match = await ComparePsw(pwd, user.pwd);
    if (!match) {
      return new Response(JSON.stringify({ message: "Contraseña Erronea" }), { status: 401 });
    }

    //Servicio Generar Token
    const token = GenerateToken(user);

    //Guarda cookie con el token
    (await cookies()).set("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    //Devuelve el rol para que la pagina decida la ruta
    return new Response(
      JSON.stringify({ message: "LogIn Exitoso", role: user.rol }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
