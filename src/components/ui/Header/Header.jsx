"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const logo = "/Perrigry_logo_ennegro.png";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { name: "Ventas totales", href: "/admin_page/total_sales" },
    { name: "Gestionar usuarios", href: "/admin_page/register_user" },
    { name: "Gestionar stock", href: "/admin_page/add_stock" },
    { name: "Facturación", href: "/sale_register" },
  ];

  const handleLogout = () => {
    try {
      // Borrar token de autenticación del localStorage (o sessionStorage)
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      // También puedes limpiar cookies del front (si las usas)
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Redirigir al login
      router.push("/");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  return (
    <header className="w-full bg-white flex items-center justify-between px-8 py-3 shadow-sm fixed top-0 left-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src={logo}
          alt="Logo Perrigry"
          width={60}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Navegación */}
      <nav className="flex gap-8 text-[17px] font-medium">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-all duration-200 px-3 py-1 rounded-md ${
                isActive
                  ? "text-white bg-orange-500"
                  : "text-gray-700 hover:text-orange-500"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Botón Cerrar sesión */}
      <button
        onClick={handleLogout}
        className="bg-[#1C2E4A] text-white px-5 py-2 text-sm font-semibold rounded-md hover:bg-[#15233a] transition"
      >
        Cerrar sesión
      </button>
    </header>
  );
}

