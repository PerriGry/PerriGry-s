import { Recognition } from "@/components/index";


export default function Home() {
  return (
    <main className="p-6  bg-[#95BBF7] min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-4">
         Reconocimiento Facial en Cliente
      </h1>
      <Recognition />
    </main>
  );
}
