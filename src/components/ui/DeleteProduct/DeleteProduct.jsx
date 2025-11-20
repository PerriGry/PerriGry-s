"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DeleteProduct() {
  const pathname = usePathname();

  // ESTADOS
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // -------------------- GET PRODUCTOS --------------------
  const getProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/products", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        setLoading(false);
        return;
      }

      // Mapear productos a un formato usable en frontend
      const mapped = data.map((p) => ({
        id: p.id_producto,
        name: p.nombre.trim(),
        price: parseFloat(p.valor_unidad),
        stock: p.stock,
      }));

      setProducts(mapped);
      setFiltered(mapped);

      setLoading(false);
    } catch (err) {
      console.error("Error GET productos:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // -------------------- FILTRO --------------------
  useEffect(() => {
    setFiltered(
      products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, products]);

  // -------------------- DELETE PRODUCT --------------------
  const deleteAction = async () => {
    if (!selected) return;

    const ok = confirm(
      `¿Seguro que deseas eliminar el producto "${selected.name}"?`
    );
    if (!ok) return;

    try {
      const res = await fetch("/api/products/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al eliminar producto");
        return;
      }

      alert("Producto eliminado correctamente");

      setSelected(null);
      getProducts(); // recargar lista
    } catch (err) {
      console.error("Error DELETE:", err);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="flex gap-10 text-black">

      {/* -------------------- PANEL IZQUIERDO -------------------- */}
      <div className="w-[300px] bg-white shadow rounded-2xl p-4 h-fit">
        <div className="font-semibold text-gray-700 mb-3">Selecciona</div>

        <div className="space-y-2">
          <Link href="/admin_page/update_product">
            <button
              className={`w-full p-4 text-left border-b ${
                pathname.includes("update_product")
                  ? "font-bold text-black"
                  : "text-gray-600"
              }`}
            >
              Actualizar productos
            </button>
          </Link>

          <Link href="/admin_page/add_stock">
            <button
              className={`w-full p-4 text-left border-b ${
                pathname.includes("add_stock")
                  ? "font-bold text-black"
                  : "text-gray-600"
              }`}
            >
              Agregar productos
            </button>
          </Link>

          <Link href="/admin_page/delete_product">
            <button
              className={`w-full p-4 text-left ${
                pathname.includes("delete_product")
                  ? "font-bold text-black"
                  : "text-gray-600"
              }`}
            >
              Eliminar productos
            </button>
          </Link>
        </div>
      </div>

      {/* -------------------- PANEL PRINCIPAL -------------------- */}
      <div className="flex-1 bg-white p-10 rounded-3xl shadow">

        <h1 className="text-3xl font-bold mb-6">Eliminar Productos</h1>

        {/* -------------------- BUSCADOR -------------------- */}
        <div className="flex items-center mb-6">
          <div className="flex items-center bg-[#E6E6E6] rounded-full px-4 py-2 w-[350px]">
            <input
              type="text"
              placeholder="Buscar prod."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none flex-1"
            />
          </div>

          <button className="ml-[-40px]">
            <Image src="/icons/search.png" width={25} height={25} alt="buscar" />
          </button>
        </div>

        {/* -------------------- GRID -------------------- */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {loading ? (
            <p className="text-gray-500">Cargando productos...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500">No se encontraron productos.</p>
          ) : (
            filtered.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelected(prod)}
                className={`rounded-xl p-4 cursor-pointer text-sm shadow 
                  ${
                    selected?.id === prod.id
                      ? "bg-[#B0D9FF]"
                      : "bg-[#E6E6E6]"
                  }
                `}
              >
                <p className="font-semibold">{prod.name}</p>
                <p className="text-gray-700">Stock: {prod.stock}</p>
                <p className="text-gray-700">Precio: ${prod.price}</p>
              </div>
            ))
          )}
        </div>

        {/* -------------------- DETALLE -------------------- */}
        {selected && (
          <div className="bg-gray-100 p-6 rounded-xl mb-6 space-y-3">
            <h2 className="text-xl font-semibold">Producto seleccionado:</h2>

            <div>
              <label className="font-medium">Nombre</label>
              <input
                type="text"
                value={selected.name}
                disabled
                className="w-full p-2 bg-white rounded-lg border mt-1"
              />
            </div>

            <div>
              <label className="font-medium">Stock</label>
              <input
                type="text"
                value={selected.stock}
                disabled
                className="w-full p-2 bg-white rounded-lg border mt-1"
              />
            </div>

            <div>
              <label className="font-medium">Precio</label>
              <input
                type="text"
                value={selected.price}
                disabled
                className="w-full p-2 bg-white rounded-lg border mt-1"
              />
            </div>
          </div>
        )}

        {/* -------------------- BOTÓN ELIMINAR -------------------- */}
        <button
          onClick={deleteAction}
          disabled={!selected}
          className={`px-10 py-3 text-white text-lg font-semibold rounded-xl 
            ${selected ? "bg-[#C62828]" : "bg-gray-400 cursor-not-allowed"}
          `}
        >
          Eliminar
        </button>

      </div>
    </div>
  );
}
