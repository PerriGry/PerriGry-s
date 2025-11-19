
"use client";
import UpdateProduct from "@/components/ui/UpdateProduct/UpdateProduct";
import { Header } from "@/components";

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-[#A9C8FF] flex justify-center pt-10">
      <Header/>
      <UpdateProduct />
      
    </div>
  );
}
