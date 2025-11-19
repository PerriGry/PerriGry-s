"use client";
import { AddStock } from "@/components";
import { Header } from "@/components";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#AFCBFF] p-10">
      <Header />
      <AddStock />
    </div>
  );
}
