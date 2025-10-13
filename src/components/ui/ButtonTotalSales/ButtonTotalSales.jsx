"use client";
import Link from "next/link";

export default function ButtonTotalSales() {
  return (
    <Link
      href="/admin_page/total_sales"
      className="w-120 h-140 border-2 border-black rounded-3xl bg-gray-600 hover:bg-black flex items-center justify-center text-lg font-bold transition-colors duration-300 ease-in-out"
    >
      <span className="text-3xl">Mostrar ventas totales</span>
      
    </Link>
  );
}
