import { ver_ventas } from "@/services/work_functions.service";
import { cookies } from "next/headers";
import { VerifyToken } from "@/services/auth.service";

export default async function TotalSales() {
  //Obtener token desde cookies en el servidor
  const token = (await cookies()).get("access_token")?.value;
  const user = VerifyToken(token);

  if (!user) {
    return <p className="text-red-600">Sesión inválida o expirada</p>;
  }

  //Llamada directa al servicio 
  const total = await ver_ventas();

  return (
    <div className="bg-gray-600 rounded-3xl shadow-lg p-8 text-center w-140 h-80 flex flex-col items-center justify-center">
      <h2 className="text-5xl font-bold text-white mb-2">Ventas Totales</h2>
      <p className="text-3xl font-extrabold text-white mt-4">
        <span className="text-green-500 mr-1">$</span>
        {(total[0]?.ventas_totales ?? 0)}
      </p>
    </div>
  );
}
