"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateProduct() {
  const pathname = usePathname();

  // Lista de productos desde el backend
  const [products, setProducts] = useState([]);

  // Producto seleccionado
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Estado de carga
  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  //          GET: OBTENER PRODUCTOS
  // -----------------------------------------
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products", { method: "GET" });
      const data = await res.json();

      if (!res.ok) return alert(data.error);

      setProducts(data);
    } catch (err) {
      alert("Error al obtener productos: " + err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // -----------------------------------------
  //          PUT: ACTUALIZAR PRODUCTO
  // -----------------------------------------
  const handleUpdate = async () => {
    if (!selectedProduct) return;

    const { id_producto, nombre, valor_unidad, stock } = selectedProduct;

    setLoading(true);

    const res = await fetch("/api/products/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id_producto,
        nombre,
        valor: Number(valor_unidad),
        cantidad: Number(stock),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return alert(data.error);

    alert("Producto actualizado correctamente");

    // Recargar listado
    fetchProducts();
  };

  // -----------------------------------------
  //          TEMPLATE PRINCIPAL
  // -----------------------------------------
  return (
    <div className="bg-white w-[900px] min-h-[550px] rounded-3xl shadow-xl p-10 text-black flex gap-10">

      {/* ------------------- Panel Izquierdo ------------------- */}
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

      {/* ------------------- Contenido Principal ------------------- */}
      <div className="flex-1">

        <h1 className="text-3xl font-bold mb-6">Actualizar Productos</h1>

        {/* Grid de productos */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {products.map((p) => (
            <div
              key={p.id_producto}
              onClick={() => setSelectedProduct(p)}
              className={`p-4 rounded-xl cursor-pointer ${
                selectedProduct?.id_producto === p.id_producto
                  ? "bg-[#B0D9FF]"
                  : "bg-[#E6E6E6]"
              }`}
            >
              <p className="font-semibold">{p.nombre.trim()}</p>
              <p className="text-sm text-gray-600">Stock: {p.stock}</p>
              <p className="text-sm text-gray-600">
                Precio: ${Number(p.valor_unidad).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* ------------------- FORMULARIO ------------------- */}
        {selectedProduct && (
          <div className="space-y-4 p-4 bg-gray-100 rounded-xl">

            <h2 className="text-xl font-semibold">Editar Producto</h2>

            {/* Nombre */}
            <div>
              <label className="font-medium">Nombre</label>
              <input
                type="text"
                value={selectedProduct.nombre}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    nombre: e.target.value,
                  })
                }
                className="w-full p-2 bg-white rounded-lg border mt-1"
              />
            </div>

            {/* Precio */}
            <div>
              <label className="font-medium">Precio</label>
              <input
                type="number"
                value={selectedProduct.valor_unidad}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    valor_unidad: e.target.value,
                  })
                }
                className="w-full p-2 bg-white rounded-lg border mt-1"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="font-medium">Stock</label>
              <input
                type="number"
                value={selectedProduct.stock}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    stock: e.target.value,
                  })
                }
                className="w-full p-2 bg-white rounded-lg border mt-1"
              />
            </div>


            {/* Botón */}
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-[#0077B6] text-white px-10 py-3 rounded-xl text-lg font-semibold"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
