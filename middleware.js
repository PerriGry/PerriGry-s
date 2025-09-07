import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
    //Obtener Acces_Token
    const token = req.cookies.get("access_token")?.value;
    //Verificar Si hay Token
    if (!token) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    try {
        //Verificar Token
        jwt.verify(token, process.env.JWT_SECRET);
        //Continuar el Flujo del EndPoint
        return NextResponse.next();
    } catch (err) {
        return NextResponse.json({ message: "Token inválido o expirado" }, { status: 403 });
    }
}

//Rutas donde se aplica el middleware
export const config = {
  matcher: ["/api/ruta/colocar"], 
};
