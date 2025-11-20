"use client";

import { useEffect, useState } from "react";

export default function TotalSales() {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  async function fetchTotalSales() {
    try {
      const response = await fetch("/api/work_functions/statistics", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (Array.isArray(data) && data[0]?.ventas_totales) {
        setTotal(data[0].ventas_totales);
      }
    } catch (error) {
      console.error("Error obteniendo ventas totales:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTotalSales();
  }, []);

  return (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-md">
      <h2 className="text-2xl text-black font-semibold mb-4">
        Acumulado total de ventas
      </h2>

      <div className="bg-white rounded-2xl p-10 text-center">
        {loading ? (
          <p className="text-xl font-semibold text-gray-500">Cargando...</p>
        ) : (
          <>
            <p className="text-4xl font-extrabold text-black">
              ${" "}
              {Number(total).toLocaleString("es-CO", {
                minimumFractionDigits: 0,
              })}
            </p>
            <p className="text-2xl font-bold text-black">COP</p>
          </>
        )}
      </div>
    </div>
  );
}
