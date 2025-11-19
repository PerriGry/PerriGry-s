"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function UpdateProduct() {

  const pathname = usePathname();

  // Estado del producto seleccionado
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mock temporal del listado
  const products = [
    { id: 1, name: "Croquetas Premium", price: 50000, stock: 20 },
    { id: 2, name: "Hueso de Juguete", price: 15000, stock: 50 },
    { id: 3, name: "Cama XL", price: 120000, stock: 5 },
  ];

  return (
    <div className="bg-white w-[900px] min-h-[550px] rounded-3xl shadow-xl p-10 text-black flex gap-10">

      {/* ------------------- Panel Izquierdo ------------------- */}
      <div className="w-[300px] bg-white shadow rounded-2xl p-4 h-fit">

        <div className="font-semibold text-gray-700 mb-3">Selecciona</div>

        <div className="space-y-2">
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

      {/* ------------------- Contenido Principal ------------------- */}
      <div className="flex-1">

        <h1 className="text-3xl font-bold mb-6">Actualizar Productos</h1>

        {/* Buscador */}
        <div className="flex items-center mb-6">
          <div className="flex items-center bg-[#E6E6E6] rounded-full px-4 py-2 w-[350px]">
            <input
              type="text"
              placeholder="Buscar producto..."
              className="bg-transparent outline-none flex-1"
            />
          </div>
          <button className="ml-[-40px]">
            <Image src="/icons/search.png" width={25} height={25} alt="buscar" />
          </button>
        </div>

        {/* Grid de productos: clic para seleccionar uno */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className={`p-4 rounded-xl cursor-pointer ${
                selectedProduct?.id === p.id
                  ? "bg-[#B0D9FF]"
                  : "bg-[#E6E6E6]"
              }`}
            >
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-600">Stock: {p.stock}</p>
              <p className="text-sm text-gray-600">Precio: ${p.price}</p>
            </div>
          ))}
        </div>

        {/* ------------------- FORMULARIO DE EDICIÓN ------------------- */}
        {selectedProduct && (
          <div className="space-y-4 p-4 bg-gray-100 rounded-xl">

            <h2 className="text-xl font-semibold">Editar Producto</h2>

            {/* Nombre */}
            <div>
              <label className="font-medium">Nombre</label>
              <input
                type="text"
                defaultValue={selectedProduct.name}
                className="w-full p-2 bg-white rounded-lg border mt-1"
              />
            </div>

            {/* Precio */}
            <div>
              <label className="font-medium">Precio</label>
              <input
                type="number"
                defaultValue={selectedProduct.price}
                className="w-full p-2 bg-white rounded-lg border mt-1"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="font-medium">Stock</label>
              <input
                type="number"
                defaultValue={selectedProduct.stock}
                className="w-full p-2 bg-white rounded-lg border mt-1"
              />
            </div>

            {/* Imagen */}
            <div>
              <label className="font-medium">Imagen</label>
              <input type="file" className="w-full p-2 bg-white rounded-lg border mt-1" />
            </div>

            {/* Botón */}
            <button className="bg-[#0077B6] text-white px-10 py-3 rounded-xl text-lg font-semibold">
              Guardar Cambios
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

