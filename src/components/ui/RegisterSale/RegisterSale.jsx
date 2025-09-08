"use client";

import { useRef } from "react";

export default function SaleForm() {
    // --- Client Refs ---
    const clientIdRef = useRef(null);
    const clientEmailRef = useRef(null);

    // --- Product Refs ---
    const productIdRef = useRef(null);
    const quantityRef = useRef(null);

    // --- Control / UI ---
    const summaryRef = useRef(null);
    const messageRef = useRef(null);
    const isClientRegistered = useRef(false);
    const orderLinesRef = useRef([]); // [{ productId, quantity }]

    const showMessage = (text, type = "ok") => {
        if (!messageRef.current) return;
        messageRef.current.textContent = text;
        messageRef.current.className =
            "text-sm mt-2 " + (type === "ok" ? "text-green-700" : "text-red-600");
    };
    const clearMessage = () => showMessage("");

    const renderSummary = () => {
        if (!summaryRef.current) return;
        if (orderLinesRef.current.length === 0) {
            summaryRef.current.textContent = "No se agregaron productos.";
            return;
        }
        const text = orderLinesRef.current
            .map(
                (l, i) => `${i + 1}. Product: ${l.productId}  |  Quantity: ${l.quantity}`
            )
            .join("\n");
        summaryRef.current.textContent = text;
    };

    //Registrar cliente
    const onRegistrarCliente = async (e) => {
        e.preventDefault();
        clearMessage();

        const clientId = (clientIdRef.current?.value || "").trim();
        const clientEmail = (clientEmailRef.current?.value || "").trim();
        if (!clientId || !clientEmail)
            return showMessage("Ingrese la cedula del cliente y el correo electrónico.", "error");

        try {
            const res = await fetch("/api/work_functions/client_register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ cedula: clientId, email: clientEmail }),
            });
            if (!res.ok) {
                let err = "Error registrando/validando cliente";
                try {
                    const j = await res.json();
                    err = j?.error || err;
                } catch { }
                throw new Error(err);
            }
            isClientRegistered.current = true;

            //Habilitar inputs de producto
            if (productIdRef.current) productIdRef.current.disabled = false;
            if (quantityRef.current) quantityRef.current.disabled = false;
            const btn = document.getElementById("btn-add-line");
            if (btn) btn.disabled = false;

            showMessage("Cliente añadido. Añade productos.");
        } catch (e2) {
            showMessage(e2.message || "Error registrando cliente", "error");
        }
    };

    // Añadir linea de producto
    const onAddLine = (e) => {
        e.preventDefault();
        clearMessage();

        if (!isClientRegistered.current)
            return showMessage("Registra al cliente primero.", "error");

        const productId = (productIdRef.current?.value || "").trim();
        const quantity = Number(quantityRef.current?.value || 0);

        if (!productId || Number.isNaN(quantity) || quantity <= 0) {
            return showMessage("Complete el ID del producto y una cantidad válida (>0).", "error");
        }

        orderLinesRef.current.push({ productId, quantity });

        // Limpiar inputs
        if (productIdRef.current) productIdRef.current.value = "";
        if (quantityRef.current) quantityRef.current.value = "1";

        renderSummary();
    };

    // Generar facturas
    const onGenerarFactura = async () => {
        clearMessage();
        if (!isClientRegistered.current)
            return showMessage("Registra el cliente primero.", "error");
        if (orderLinesRef.current.length === 0)
            return showMessage("Añade al menos un producto.", "error");

        const clientId = parseInt(clientIdRef.current?.value, 10);
        const paymentMethodId = 1; // default: efectivo

        try {
            const productIds = orderLinesRef.current.map((l) =>
                parseInt(l.productId, 10)
            );
            const quantities = orderLinesRef.current.map((l) =>
                parseInt(l.quantity, 10)
            );

            const payload = {
                cedula_cliente: clientId,
                id_metodo_pago: paymentMethodId,
                id_productos: productIds,
                cantidad: quantities,
            };

            const res = await fetch("/api/work_functions/sale_register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                let err = "Error registrando la venta";
                try {
                    const j = await res.json();
                    err = j?.error || err;
                } catch { }
                throw new Error(err);
            }

            showMessage("Factura generada correctamente");

        } catch (e) {
            showMessage(e.message || "Error generando factura", "error");
        }
    };

    return (
        <div className="min-h-screen bg-yellow-200 text-black p-6 ">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 ">
                {/* Parte izquierda */}
                <div className="lg:col-span-2 space-y-6 ">
                    {/* Client */}
                    <div className="border rounded-2xl p-5 shadow-sm bg-gray-600 text-white">
                        <h2 className="text-2xl font-bold mb-4">Cliente</h2>
                        <form onSubmit={onRegistrarCliente} className="space-y-3">
                            <div>
                                <label className="block text-sm font-semibold mb-1">
                                    Cedula
                                </label>
                                <input
                                    ref={clientIdRef}
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
                                    placeholder="ej. 1012345678"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">
                                    Email
                                </label>
                                <input
                                    ref={clientEmailRef}
                                    type="email"
                                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
                                    placeholder="cliente@gmail.com"
                                />
                            </div>
                            <button className="px-4 py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 font-semibold cursor-pointer transition-colors duration-200 ease-in-out mb-3">
                                Registrar cliente
                            </button>
                        </form>
                        <span > Tienes que agregar el cliente para añadir productos</span>
                    </div>

                    {/*Producto*/}
                    <div className="border rounded-2xl p-5 shadow-sm bg-gray-600 text-white">
                        <h2 className="text-2xl font-bold mb-4">Producto</h2>
                        <form onSubmit={onAddLine} className="space-y-3">
                            <div>
                                <label className="block text-sm font-semibold mb-1">
                                    ID Producto
                                </label>
                                <input
                                    ref={productIdRef}
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
                                    placeholder="ej. 10"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">
                                    Cantidad
                                </label>
                                <input
                                    ref={quantityRef}
                                    type="number"
                                    defaultValue={1}
                                    min={1}
                                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
                                    disabled
                                />
                            </div>
                            <button
                                id="btn-add-line"
                                className="px-4 py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 font-semibold cursor-pointer transition-colors duration-200 ease-in-out"
                                disabled
                            >
                                Añadir producto a la factura
                            </button>
                        </form>
                    </div>
                </div>

                {/* Cuenta */}
                <div className="lg:col-span-1 border rounded-2xl p-5 shadow-sm bg-gray-600 text-white">
                    <h2 className="text-2xl font-bold mb-4">Cuenta</h2>
                    <p
                        ref={summaryRef}
                        className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-lg min-h-[220px] text-black"
                    >
                        Ningun producto ha sido añadido.
                    </p>

                    <button
                        onClick={onGenerarFactura}
                        className="mt-4 w-full py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 font-semibold cursor-pointer transition-colors duration-200 ease-in-out"
                        type="button"
                    >
                        Generar factura
                    </button>

                    <div ref={messageRef} className="text-sm mt-2"></div>
                </div>
            </div>
        </div>
    );
}
