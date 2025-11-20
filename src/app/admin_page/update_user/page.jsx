"use client";

import Link from "next/link";
import {UpdateUser} from "@/components/index";
import { Header } from "@/components/index";

export default function UpdateUserPage() {
  return (
    <div className="mt-10 min-h-screen w-full bg-[#95BBF7] flex flex-col md:flex-row p-10 relative">
      <Header/>

      {/* BOTÓN VOLVER */}
      <Link
        href="/admin_page"
        className="absolute bottom-6 left-6 bg-[#123C83] text-white px-6 py-2 rounded-full shadow-md hover:bg-[#0F2F6A] transition"
      >
        Volver
      </Link>

      {/* PANEL IZQUIERDO */}
      <div className="w-full md:w-1/2 flex flex-col pl-6">

        <h1 className="text-4xl font-bold mb-10 text-black">
          Gestión de Usuarios
        </h1>

        <div className="border-l-4 border-dotted border-black h-0 md:h-40 ml-10"></div>

        {/* BOTONES */}
        <Link href="/admin_page/register_user">
          <button className="bg-white text-black px-6 py-4 rounded-full text-xl shadow-md border mb-6 w-[250px]">
            Agregar Usuario
          </button>
        </Link>

        {/* ACTIVO */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-0 md:w-10 h-0 md:h-10 border-t-4 border-black border-dotted"></div>
          <button className="bg-[#123C83] text-white px-6 py-4 rounded-full text-xl shadow-md">
            Actualizar Usuario
          </button>
        </div>

        <Link href="/admin_page/delete_user">
          <button className="bg-white text-black px-6 py-4 rounded-full text-xl shadow-md border w-[250px]">
            Eliminar Usuario
          </button>
        </Link>
      </div>

      {/* PANEL DERECHO */}
      <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
        <UpdateUser />
      </div>
    </div>
  );
}
