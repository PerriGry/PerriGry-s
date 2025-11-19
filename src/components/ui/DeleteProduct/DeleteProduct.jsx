"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DeleteProduct() {

  const pathname = usePathname();

  // Productos simulados                    ↓↓↓ AQUI LUEGO IRÁ TU API REAL
  const sampleProducts = [
    { id: 1, name: "Croquetas Premium", stock: 20, price: 50000 },
    { id: 2, name: "Hueso de Juguete", stock: 50, price: 15000 },
    { id: 3, name: "Cama Suave XL", stock: 5, price: 120000 },
    { id: 4, name: "Collar Antipulgas", stock: 80, price: 30000 },
    { id: 5, name: "Arena para gato 10kg", stock: 15, price: 45000 },
  ];

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = sampleProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-10 text-black">

      {/* -------------------- PANEL IZQUIERDO -------------------- */}
      <div className="w-[300px] bg-white shadow rounded-2xl p-4 h-fit">

        <div className="font-semibold text-gray-700 mb-3">Selecciona</div>

        <div className="space-y-2">

          {/* Actualizar productos */}
          <Link href="/admin_page/update_product">
            <button
              className={`w-full p-4 text-left border-b ${
                pathname.includes("update_product")
                  ? "font-bold text-black"
                  : "text-gray-600"
              }`}
            >
              Actualizar productos
            </button>
          </Link>

          {/* Agregar productos */}
          <Link href="/admin_page/add_stock">
            <button
              className={`w-full p-4 text-left border-b ${
                pathname.includes("add_stock")
                  ? "font-bold text-black"
                  : "text-gray-600"
              }`}
            >
              Agregar productos
            </button>
          </Link>

          {/* Eliminar productos */}
          <Link href="/admin_page/delete_product">
            <button
              className={`w-full p-4 text-left ${
                pathname.includes("delete_product")
                  ? "font-bold text-black"
                  : "text-gray-600"
              }`}
            >
              Eliminar productos
            </button>
          </Link>
        </div>
      </div>

      {/* -------------------- PANEL PRINCIPAL -------------------- */}
      <div className="flex-1 bg-white p-10 rounded-3xl shadow">

        <h1 className="text-3xl font-bold mb-6">Eliminar Productos</h1>

        {/* -------------------- BUSCADOR -------------------- */}
        <div className="flex items-center mb-6">
          <div className="flex items-center bg-[#E6E6E6] rounded-full px-4 py-2 w-[350px]">
            <input
              type="text"
              placeholder="Buscar prod."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none flex-1"
            />
          </div>

          <button className="ml-[-40px]">
            <Image src="/icons/search.png" width={25} height={25} alt="buscar" />
          </button>
        </div>

        {/* -------------------- GRID DE PRODUCTOS -------------------- */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {filtered.length === 0 ? (
            <p className="text-gray-500">No se encontraron productos.</p>
          ) : (
            filtered.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelected(prod)}
                className={`rounded-xl p-4 cursor-pointer text-sm shadow 
                ${
                  selected?.id === prod.id
                    ? "bg-[#B0D9FF]"
                    : "bg-[#E6E6E6]"
                }`}
              >
                <p className="font-semibold">{prod.name}</p>
                <p className="text-gray-700">Stock: {prod.stock}</p>
                <p className="text-gray-700">Precio: ${prod.price}</p>
              </div>
            ))
          )}
        </div>

        {/* -------------------- DETALLE DEL PRODUCTO -------------------- */}
        {selected && (
          <div className="bg-gray-100 p-6 rounded-xl mb-6 space-y-3">
            <h2 className="text-xl font-semibold">Producto seleccionado:</h2>

            <div>
              <label className="font-medium">Nombre</label>
              <input
                type="text"
                value={selected.name}
                disabled
                className="w-full p-2 bg-white rounded-lg border mt-1"
              />
            </div>

            <div>
              <label className="font-medium">Stock</label>
              <input
                type="text"
                value={selected.stock}
                disabled
                className="w-full p-2 bg-white rounded-lg border mt-1"
              />
            </div>

            <div>
              <label className="font-medium">Precio</label>
              <input
                type="text"
                value={selected.price}
                disabled
                className="w-full p-2 bg-white rounded-lg border mt-1"
              />
            </div>
          </div>
        )}

        {/* -------------------- BOTÓN ELIMINAR -------------------- */}
        <button
          disabled={!selected}
          className={`px-10 py-3 text-white text-lg font-semibold rounded-xl 
            ${selected ? "bg-[#C62828]" : "bg-gray-400 cursor-not-allowed"}
          `}
        >
          Eliminar
        </button>

      </div>
    </div>
  );
}

