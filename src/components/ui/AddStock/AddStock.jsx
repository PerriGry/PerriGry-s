"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AddStock() {
  const pathname = usePathname();

  const [form, setForm] = useState({
    nombre: "",
    valor: "",
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
    if (!form.nombre || !form.valor || !form.cantidad)
      return alert("Por favor completa todos los campos");

    setLoading(true);

    const res = await fetch("/api/products/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: form.nombre,
        valor: Number(form.valor),
        cantidad: Number(form.cantidad),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert("Error: " + data.error);
      return;
    }

    alert("Producto registrado correctamente");

    setForm({
      nombre: "",
      valor: "",
      cantidad: "",
    });
  };

  return (
    <div className="mt-10 flex gap-10 text-black">

      {/* ------------------- Panel Izquierdo ------------------- */}
      <div className="w-[300px] bg-white shadow rounded-2xl p-4 h-fit">
        <div className="font-semibold text-gray-700 mb-3">Selecciona</div>

        <div className="space-y-2">
          <Link href="/admin_page/update_product">
            <button
              className={`w-full p-4 text-left border-b ${
                pathname.includes("actualizar") ? "font-bold" : "text-gray-600"
              }`}
            >
              Actualizar productos
            </button>
          </Link>

          <Link href="/admin_page/add_stock">
            <button
              className={`w-full p-4 text-left border-b ${
                pathname.includes("agregar") ? "font-bold" : "text-gray-600"
              }`}
            >
              Agregar productos
            </button>
          </Link>

          <Link href="/admin_page/delete_product">
            <button
              className={`w-full p-4 text-left ${
                pathname.includes("eliminar") ? "font-bold" : "text-gray-600"
              }`}
            >
              Eliminar productos
            </button>
          </Link>
        </div>
      </div>

      {/* ------------------- Panel Central ------------------- */}
      <div className="flex-1 bg-white shadow rounded-3xl p-10">
        <h1 className="text-3xl font-bold mb-8 text-black">Agregar Producto</h1>

        <div className="grid grid-cols-2 gap-10">

          {/* ---- Formulario ---- */}
          <div className="space-y-6">

            <div>
              <label className="text-black font-medium">Nombre del producto:</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full bg-gray-200 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="text-black font-medium">Precio:</label>
              <input
                name="valor"
                type="number"
                value={form.valor}
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

        </div>
      </div>

    </div>
  );
}
