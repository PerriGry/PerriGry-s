import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { VerifyToken } from "@/services/auth.service"; 

export default async function AdminLayout({ children }) {
  const token = cookies().get("access_token")?.value || null;

  let payload = null;
  try {
    payload = token ? await VerifyToken(token) : null;
  } catch {
    payload = null;
  }

  // El nombre del campo y el valor exacto
  const role = payload?.rol ?? payload?.role; // acepta "rol" o "role"
  if (role !== "Administrador") {
    redirect("/"); 
  }

  return <div className="min-h-screen bg-yellow-200">{children}</div>;
}
