import { cookies } from "next/headers";
import { GenerateToken, VerifyInitToken, FindEmail } from "@/services/auth.service";

export async function GET() {
  try {
    //Instanciar Cookies Una Sola Vez
    const cookieStore = await cookies(); 
    //Obtener el Init Token
    const init_token = cookieStore.get("init_token")?.value;
    //Verificar validez de Init Token
    const result = VerifyInitToken(init_token);
    if (!result) {
        return new Response(
            JSON.stringify({ error: "Token inválido o expirado" }),
            { status: 403 }
        );
    }
    //Servicio de Buscar Email, segun el email de Init Token
    const user = await FindEmail(result.email);
    //Servicio de Generar Access Token
    const token = GenerateToken(user);
    //Guardar Access Token en Una cookie
    cookieStore.set("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
    });
    //Eliminar Init Token
    cookieStore.delete("init_token"); 
    //Retornar Respuesta
    return new Response(
        JSON.stringify({ Message: "Login Exitoso" }),
        { status: 200 }
    );

  } catch (error) {
    return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
    );
  }
}
