"use client";

import { Header } from "@/components";
import {TotalSales} from "@/components";
import { useState } from "react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-blue-300">
      <Header />

      <div className="px-16 py-10">
        {/* TITULOS */}
        <div className="grid grid-cols-2 mb-8">
          <h1 className="text-4xl font-bold">Ventas totales</h1>
          <h1 className="text-4xl font-bold text-center">
            Productos vendidos
          </h1>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-2 gap-14">
          {/* COLUMNA IZQUIERDA */}
          <div>
            <TotalSales />

            {/* BOTÓN VOLVER */}
            <div className="mt-12">
              <button className="bg-blue-900 text-white px-6 py-2 rounded-full shadow">
                Volver
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-md">
            {/* BUSCADOR */}
            <div className="flex items-center bg-white rounded-full px-5 py-3 mb-6 shadow">
              <input
                type="text"
                placeholder="Buscar"
                className="flex-1 outline-none text-black"
              />
              <button>
                <Image
                  src="/icons/search.png"
                  alt="buscar"
                  width={24}
                  height={24}
                />
              </button>
            </div>

            {/* TARJETA DE PRODUCTO */}
            <div className="grid grid-cols-2 gap-5 text-black">
              <Image
                src="/images/agility.jpg"
                alt="producto"
                width={200}
                height={200}
                className="rounded-xl object-contain bg-white shadow"
              />

              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Alimento agility GOLD
                </h2>

                <p className="font-medium">
                  Cantidad en stock:{" "}
                  <span className="font-normal">35 unidades</span>
                </p>

                <p className="font-medium">
                  Cantidades vendidas:{" "}
                  <span className="font-normal">0 unidades</span>
                </p>

                <p className="font-medium">
                  Costo por unidad:{" "}
                  <span className="font-normal">$10.000</span>
                </p>

                <p className="font-medium">
                  Monto total acumulado:{" "}
                  <span className="font-normal">$734.675</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
