
"use client";
import { DeleteProduct } from "@/components";
import { Header } from "@/components/index";

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-[#A9C8FF] flex justify-center pt-10">
      <Header/>
      <DeleteProduct />
    </div>
  );
}
