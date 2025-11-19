"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AddStock() {
  const pathname = usePathname();

  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    precio: "",
    cantidad: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch("/api/products/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (data.ok) {
      alert("Producto registrado correctamente");

      setForm({
        nombre: "",
        codigo: "",
        precio: "",
        cantidad: "",
      });
    } else {
      alert("Error: " + data.error);
    }
  };

  return (
    <div className="flex gap-10 text-black">

      {/* ------------------- Panel Izquierdo (Corregido) ------------------- */}
      <div className="w-[300px] bg-white shadow rounded-2xl p-4 h-fit">
        <div className="font-semibold text-gray-700 mb-3">
          Selecciona
        </div>

        <div className="space-y-2">

          {/* Actualizar productos */}
          <Link href="/admin_page/update_product">
            <button
              className={`w-full p-4 text-left border-b ${
                pathname.includes("actualizar")
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
                pathname.includes("agregar")
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
                pathname.includes("eliminar")
                  ? "font-bold text-black"
                  : "text-gray-600"
              }`}
            >
              Eliminar productos
            </button>
          </Link>

        </div>
      </div>

      {/* ------------------- Panel Central (Formulario) ------------------- */}
      <div className="flex-1 bg-white shadow rounded-3xl p-10">
        <h1 className="text-3xl font-bold mb-8 text-black">Agregar Producto</h1>

        <div className="grid grid-cols-2 gap-10">

          {/* ---- Formulario ---- */}
          <div className="space-y-6">

            <div>
              <label className="text-black font-medium">Nombre nuevo producto:</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full bg-gray-200 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="text-black font-medium">Código producto:</label>
              <input
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                className="w-full bg-gray-200 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="text-black font-medium">Precio:</label>
              <input
                name="precio"
                type="number"
                value={form.precio}
                onChange={handleChange}
                className="bg-gray-200 rounded-xl p-3 w-[150px]"
              />
            </div>

            <div>
              <label className="text-black font-medium">Cantidad:</label>
              <input
                name="cantidad"
                type="number"
                value={form.cantidad}
                onChange={handleChange}
                className="bg-gray-200 rounded-xl p-3 w-[150px]"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#1E4266] text-white rounded-xl px-8 py-3 mt-4"
            >
              {loading ? "Guardando..." : "Agregar"}
            </button>
          </div>

          {/* ---- Imagen Placeholder ---- */}
          <div className="flex flex-col items-center justify-start">
            <p className="font-medium mb-3 text-black">Foto:</p>

            <div className="w-56 h-56 bg-gray-200 rounded-xl flex justify-center items-center">
              <Image
                src="/icons/camera.png"
                width={120}
                height={120}
                alt="placeholder"
              />
            </div>

            <button className="mt-5 bg-[#1E4266] text-white px-8 py-2 rounded-xl">
              Agregar foto
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

