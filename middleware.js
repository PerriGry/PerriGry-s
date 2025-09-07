import { NextResponse } from "next/server";
import { VerifyToken } from "@/services/auth.service";

export async function middleware(req) {
    //Obtener Acces_Token
    const token = req.cookies.get("access_token")?.value;
    //Verificar Si hay Token
    if (!token) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    try {
        //Verificar Token
        VerifyToken(token)
        //Continuar el Flujo del EndPoint
        return NextResponse.next();
    } catch (err) {
        return NextResponse.json({ message: "Token inválido o expirado" }, { status: 403 });
    }
}

//Rutas donde se aplica el middleware
export const config = {
  matcher: ["/api/work_functions/sale_register"], 
};
