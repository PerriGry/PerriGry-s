"use client";

import { useRef } from "react";

export default function UpdateUser() {
  const emailRef = useRef();
  const nameRef = useRef();
  const roleRef = useRef();

  const handleUpdate = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value.trim().toLowerCase();
    const name = nameRef.current.value.trim();   // <--- nombre ahora es "name"
    const rol = roleRef.current.value.trim();

    if (!email) return alert("Ingresa el email del usuario a actualizar");

    try {
      const res = await fetch("/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, rol }), // <--- parámetros corregidos
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Error al actualizar");

      alert("Usuario actualizado correctamente");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-[#123C83] text-center">
        Actualizar Usuario
      </h2>

      <form onSubmit={handleUpdate} className="space-y-5">

        <div>
          <label className="block text-black font-semibold">Email del usuario</label>
          <input
            ref={emailRef}
            type="email"
            className="w-full text-black border rounded-xl px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold text-black">Nuevo Nombre</label>
          <input
            ref={nameRef}
            type="text"
            className="w-full border rounded-xl px-3 py-2 text-black"
          />
        </div>

        <div>
          <label className="block font-semibold text-black">Nuevo Rol</label>
          <select
            ref={roleRef}
            className="w-full border rounded-xl px-3 py-2 text-black"
          >
            <option value="Empleado">Empleado</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-[#123C83] text-white font-bold py-2 rounded-xl hover:bg-[#0F2F6A]"
        >
          Actualizar
        </button>
      </form>
    </div>
  );
}
