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
}
