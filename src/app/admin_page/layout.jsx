// src/app/admin_page/layout.jsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { VerifyToken } from "@/services/auth.service"; // podría ser async

export default async function AdminLayout({ children }) {
  const token = cookies().get("access_token")?.value || null;

  let payload = null;
  try {
    // si VerifyToken es async, deja el await; si es sync, quita el await
    payload = token ? await VerifyToken(token) : null;
  } catch {
    payload = null;
  }

  // OJO con el nombre del campo y el valor exacto
  const role = payload?.rol ?? payload?.role; // acepta "rol" o "role"
  if (role !== "Administrador") {
    redirect("/"); // o "/login"
  }

  return <section className="min-h-screen bg-yellow-200">{children}</section>;
}
