"use client";

import { Header } from "@/components";
import { TotalSales } from "@/components";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // LLAMAR AL ENDPOINT top_Sales
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/work_functions/top_Sales", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Error al obtener productos vendidos");
          return;
        }

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetch:", error);
      }
    }

    fetchData();
  }, []);

  // FILTRO
  const filtered = products.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-300">
      <Header />

      <div className="mt-10 px-16 py-10">
        {/* TITULOS */}
        <div className="grid grid-cols-2 mb-8">
          <h1 className="text-4xl font-bold">Ventas totales</h1>
          <h1 className="text-4xl font-bold text-center">Productos vendidos</h1>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-2 gap-14">

          {/* COLUMNA IZQUIERDA */}
          <div>
            <TotalSales />
          </div>

          {/* COLUMNA DERECHA */}
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-md text-black">

            {/* LISTA DE PRODUCTOS */}
            <div className="flex flex-col gap-6 max-h-[600px] overflow-y-auto pr-3">

              {filtered.length === 0 && (
                <p className="text-center text-gray-700">
                  No se encontraron productos.
                </p>
              )}

              {filtered.map((prod) => (
                <div
                  key={prod.id_producto}
                  className="grid grid-cols-2 gap-5 bg-white rounded-2xl p-4 shadow"
                >

                  <div>
                    <h2 className="text-xl font-semibold mb-3">
                      {prod.nombre.trim()}
                    </h2>

                    <p className="font-medium">
                      Cantidades vendidas:{" "}
                      <span className="font-normal">
                        {prod["UNIDADES VENDIDAS"]} unidades
                      </span>
                    </p>

                    <p className="font-medium">
                      Monto total acumulado:{" "}
                      <span className="font-normal">
                        ${Number(prod.venta).toLocaleString("es-CO")}
                      </span>
                    </p>
                  </div>
                </div>
              ))}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
