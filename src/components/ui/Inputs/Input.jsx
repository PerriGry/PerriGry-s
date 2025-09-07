"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation"; //no se para q es, cardenas ayuda

export default function Inputs() {
  const cedulaRef = useRef(null);
  const emailRef = useRef(null);
  const idprodRef = useRef(null);
  const cantRef = useRef(null);

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    const cedula = cedulaRef.current.value;
    const email = emailRef.current.value;
    const id_producto = idprodRef.current.value;
    const cantidad = cantRef.current.value;

    if (cedula && email && id_producto && cantidad) {
      console.log({ cedula, email, id_producto, cantidad });
      router.push("/sapo");
    } else {
      alert("rellena todos los campos");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div>
          <h2 className="text-xl font-bold mb-2 text-black">Registro cliente</h2>
          <label className="block font-semibold text-black">Cedula:</label>
          <input
            type="text"
            ref={cedulaRef}
            className="w-64 px-2 py-1 border border-black bg-gray-200 text-black"
          />
          <label className="block font-semibold text-black mt-3">Email:</label>
          <input
            type="email"
            ref={emailRef}
            className="w-96 px-2 py-1 border border-black bg-gray-200 text-black"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 text-black">PerryProductos</h2>
          <label className="block font-semibold text-black">ID PRODUCTO:</label>
          <input
            type="text"
            ref={idprodRef}
            className="w-64 px-2 py-1 border border-black bg-gray-200 text-black"
          />
          <div className="mt-3 flex items-center space-x-3">
            <label className="font-semibold text-black">CANTIDAD:</label>
            <input
              type="number"
              ref={cantRef}
              className="w-20 px-2 py-1 border border-black bg-gray-200 text-black"
            />
            <button
              type="submit"
              className="px-4 py-1 rounded-full bg-yellow-500 text-black font-semibold"
            >
              Enviar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

