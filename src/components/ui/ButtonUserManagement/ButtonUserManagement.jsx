"use client";
import Link from "next/link";

export default function ButtonUserManagement() {
  return (
    <Link
      href="/UserManagement/UserManagement"
      className="text-black flex items-center justify-center text-lg font-bold transition-colors duration-200 ease-in-out"
    >
      <span className=" ">Gestionar usuarios</span>
    </Link>
  );
}