"use client";

import { useEffect, useState } from "react";

export default function DeleteUser() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);

  // ────────────────────────────────
  // CARGAR USUARIOS DEL BACKEND
  // ────────────────────────────────
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/auth/users");
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);
        } else {
          alert("Error cargando usuarios");
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    };

    fetchUsers();
  }, []);

  // ────────────────────────────────
  // ELIMINAR USUARIO
  // ────────────────────────────────
  const handleDelete = async () => {
    if (!selected) return alert("Selecciona un usuario");

    if (!confirm(`¿Eliminar a ${selected.nombre}?`)) return;

    try {
      const res = await fetch("/api/auth/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selected.email }),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.error || "Error al eliminar");

      alert("Usuario eliminado");

      // Quitar de la lista sin recargar
      setUsers(users.filter(u => u.email !== selected.email));
      setSelected(null);

    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-3xl text-black font-bold text-center mb-6">Seleccione un Usuario</h2>

      {/* LISTA DE USUARIOS */}
      <div className="space-y-4 max-h-[350px] overflow-auto pr-2">
        {users.length === 0 ? (
          <p className="text-center text-gray-500">No hay usuarios registrados</p>
        ) : (
          users.map((user, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition ${
                selected?.email === user.email
                  ? "bg-[#dce7fb] border-2 border-[#123C83]"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelected(user)}
            >
              <div className="flex items-center gap-4">
                {/* Avatar genérico */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-400">
                  <img
                    src={user.image || "/icons/user.png"}
                    className="w-full h-full object-cover"
                    alt="avatar"
                  />
                </div>

                <div>
                  <p className="font-bold">Nombre: {user.nombre}</p>
                  <p>Email: {user.email}</p>
                </div>
              </div>

              <p className="text-sm font-semibold">Rol: {user.rol}</p>
            </div>
          ))
        )}
      </div>

      {/* BOTÓN ROJO */}
      <button
        onClick={handleDelete}
        className="w-full bg-red-600 text-white font-bold py-3 rounded-full mt-8 hover:bg-red-700 transition"
      >
        Eliminar usuario
      </button>
    </div>
  );
}
