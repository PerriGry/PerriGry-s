"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function RegisterUser() {
  const router = useRouter();
  const nombreRef = useRef(null);
  const emailRef = useRef(null);
  const pwdRef = useRef(null);
  const rolRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nombre = nombreRef.current.value.trim();
    const email = emailRef.current.value.trim().toLowerCase();
    const pwd = pwdRef.current.value.trim();
    const rol = rolRef.current.value.trim();

    if (!nombre || !email || !pwd || !rol) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, pwd, rol }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al registrar usuario");
        return;
      }

      alert("Usuario registrado correctamente");

      // limpiar inputs
      nombreRef.current.value = "";
      emailRef.current.value = "";
      pwdRef.current.value = "";
      rolRef.current.value = "Empleado";

      router.push("/faceregister");
    } catch (err) {
      alert("Ocurrió un error: " + err.message);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10 border border-gray-200">
      <h2 className="text-3xl font-bold text-center mb-8 text-black">
        Agregar Usuario
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Nombre:</label>
          <input
            type="text"
            ref={nombreRef}
            className="w-full rounded-xl px-4 py-3 bg-gray-100 border text-black border-gray-300 focus:outline-none"
            placeholder="Nombre"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            ref={emailRef}
            className="w-full rounded-xl px-4 py-3 bg-gray-100 border text-black border-gray-300 focus:outline-none"
            placeholder="Email"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Contraseña:</label>
          <input
            type="password"
            ref={pwdRef}
            className="w-full rounded-xl px-4 py-3 bg-gray-100 border text-black border-gray-300 focus:outline-none"
            placeholder="Contraseña"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Rol:</label>
          <select
            ref={rolRef}
            defaultValue="Empleado"
            className="w-full rounded-xl px-4 py-3 bg-gray-100 border text-black border-gray-300 focus:outline-none"
          >
            <option value="Empleado">Empleado</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#123C83] text-white font-semibold rounded-xl hover:bg-[#0F2F6A] transition"
        >
          Agregar
        </button>
      </form>
    </div>
  );
}
