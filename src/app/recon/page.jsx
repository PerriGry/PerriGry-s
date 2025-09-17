import { Recognition } from "@/components/index";


export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        👤 Reconocimiento Facial en Cliente
      </h1>
      <Recognition />
    </main>
  );
}
