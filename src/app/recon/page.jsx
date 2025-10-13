import { Recognition } from "@/components/index";


export default function Home() {
  return (
    <main className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">
        👤 Reconocimiento Facial en Cliente
      </h1>
      <Recognition />
    </main>
  );
}
