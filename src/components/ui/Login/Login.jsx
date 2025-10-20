/*
No pienso borrar nada de esto 

"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const userIcon = "/userIcon.png";

export default function Login() {
  const idRef = useRef(null);    // aquí iría el email
  const passRef = useRef(null);  // aquí la password
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = (idRef.current?.value || "").trim()
    const pwd   = (passRef.current?.value || "").trim();

    if (!email || !pwd) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",    // importante para recibir la cookie
        body: JSON.stringify({ email, pwd }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Error al iniciar sesión");
        return;
      }

      //Redirecciona por rol
      if (data.role === "Administrador") {
        router.push("/admin_page");
      } else {
        
        router.push("/sale_register");
      }
    } catch (err) {
      alert("Ocurrió un error. Intenta de nuevo.");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        backgroundImage: "url('/background1920.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-yellow-400 p-10 rounded-2xl shadow-lg w-96">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
            <Image src={userIcon} width={80} height={80} alt="user icon" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-bold mb-6 text-black">
          Iniciar sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-black">Email</label>
            <input
              type="text"
              ref={idRef}
              className="w-full px-3 py-2 rounded-2xl border border-black bg-white text-black"
            />
          </div>
          <div>
            <label className="block font-semibold text-black">Contraseña:</label>
            <input
              type="password"
              ref={passRef}
              className="w-full px-3 py-2 rounded-2xl border border-black bg-white text-black"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-45 bg-black text-white py-2 rounded-full font-bold cursor-pointer"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} */

"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const idRef = useRef(null);    // Email
  const passRef = useRef(null);  // Contraseña
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = (idRef.current?.value || "").trim();
    const pwd = (passRef.current?.value || "").trim();

    if (!email || !pwd) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, pwd }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Error al iniciar sesión");
        return;
      }

      // Redirección por rol
      if (data.role === "Administrador") {
        router.push("/admin_page");
      } else {
        router.push("/sale_register");
      }
    } catch (err) {
      alert("Ocurrió un error. Intenta de nuevo.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#95BBF7]">
      <div className="bg-white rounded-3xl shadow-lg w-[400px] p-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-4">
          <Image
            src="/perrigry_logo_ennegro.png"
            alt="Perrigy logo"
            width={180}
            height={100}
            priority
          />
        </div>

        {/* Título */}
        <h2 className="text-3xl font-bold text-black mb-6 text-center">
          Iniciar Sesión
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block font-semibold text-black mb-1">Email:</label>
            <input
              type="text"
              ref={idRef}
              placeholder="Email"
              className="w-full px-4 py-2 bg-gray-200 text-black rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-black mb-1">Contraseña:</label>
            <input
              type="password"
              ref={passRef}
              placeholder="Contraseña"
              className="w-full px-4 py-2 bg-gray-200 text-black rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
            />
          </div>

          {/* Botón */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="bg-[#1E3A5F] hover:bg-[#294A7C] text-white font-semibold py-2 px-6 rounded-full transition duration-300"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



