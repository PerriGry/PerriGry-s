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

    const nombre = (nombreRef.current.value || "").trim();
    const email = (emailRef.current.value || "").trim().toLowerCase();
    const pwd = (pwdRef.current.value || "").trim();
    const rol = (rolRef.current.value || "").trim();

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
        alert(data.message || "Error al registrar usuario");
        return;
      }

      alert("Usuario registrado correctamente");
      //Limpieza del form después de registrar
      nombreRef.current.value = "";
      emailRef.current.value = "";
      pwdRef.current.value = "";
      rolRef.current.value = "Empleado";

      router.push('/faceregister')

    } catch (err) {
      alert("Ocurrió un error: " + err.message);
    }
  };

  return (
    <div className="w-full max-w-md bg-gray-600 rounded-3xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-white flex justify-center">
        Registrar Usuario
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-white font-bold">Nombre</label>
          <input
            type="text"
            ref={nombreRef}
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-white font-bold">Email</label>
          <input
            type="email"
            ref={emailRef}
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-white font-bold">Contraseña</label>
          <input
            type="password"
            ref={pwdRef}
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-white font-bold">Rol</label>
          <select
            ref={rolRef}
            defaultValue="Empleado"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 appearance-none"
          >
            <option value="Empleado" className="bg-gray-600">Empleado</option>
            <option value="Administrador" className="bg-gray-600">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl cursor-pointer transition-colors duration-200 ease-in-out"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
