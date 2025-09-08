"use client";
import Link from "next/link";

export default function ButtonRegisterUser() {
  return (
    <Link
      href="/admin_page/register_user"
      className="w-120 h-140 border-2 border-black rounded-3xl bg-gray-600 hover:bg-black flex items-center justify-center text-lg font-bold transition-colors duration-200 ease-in-out"
    >
      <span className="text-3xl">Registrar usuario</span>
    </Link>
  );
}
