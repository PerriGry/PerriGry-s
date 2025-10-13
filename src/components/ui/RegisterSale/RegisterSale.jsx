"use client";

import { useRef } from "react";

export default function SaleForm() {
    // Refs cliente
    const clientIdRef = useRef(null);
    const clientNameRef = useRef(null);
    const clientEmailRef = useRef(null);

    // Refs producto
    const productIdRef = useRef(null);
    const quantityRef = useRef(null);

    // Control / UI
    const summaryRef = useRef(null);
    const messageRef = useRef(null);
    const messageTimerRef = useRef(null); //timer para autolimpiar
    const isClientRegistered = useRef(false);
    const orderLinesRef = useRef([]); // [{ productId, quantity, name? }]

    // Método de Pago
    const paymentWrapRef = useRef(null);   // contenedor
    const paymentSelectRef = useRef(null); // <select>
    const paymentDataRef = useRef([]);     // [{id_metodo, nombre}]

    const showMessage = (text, type = "ok") => {
        if (!messageRef.current) return;

        // Estilos para el mensaje
        const base = "text-2xl mt-5";
        const color = type === "ok" ? "text-green-300" : "text-red-300";

        messageRef.current.textContent = text;
        messageRef.current.className = `${base} ${color}`;

        // limpiar timers anteriores
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);

        // borrar mensaje en 5s
        if (text) {
            messageTimerRef.current = setTimeout(() => {
                if (!messageRef.current) return;
                // solo borra si sigue mostrando el mismo texto (evita borrar mensajes nuevos)
                if (messageRef.current.textContent === text) {
                    messageRef.current.textContent = "";
                    messageRef.current.className = base;
                }
            }, 5000);
        }
    };
    const clearMessage = () => showMessage("");

    const setEmptySummary = () => {
        if (summaryRef.current) summaryRef.current.textContent = "No se agregaron productos.";
    };

    const renderSummary = () => {
        if (!summaryRef.current) return;
        if (orderLinesRef.current.length === 0) {
            setEmptySummary();
            return;
        }
        const text = orderLinesRef.current
            .map(
                (l, i) =>
                    `${i + 1}. ${l.name ? `${l.name} (ID ${l.productId})` : `Producto: ${l.productId}`}  |  Cantidad: ${l.quantity}`
            )
            .join("\n");
        summaryRef.current.textContent = text;
    };

    // Mostrar selector de pago cuando entra el primer producto
    const ensurePaymentSelector = async () => {
        if (paymentDataRef.current.length > 0) {
            if (paymentWrapRef.current) paymentWrapRef.current.classList.remove("hidden");
            return;
        }
        try {
            const res = await fetch("/api/work_functions/payment_methods", { method: "GET" });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "No se pudieron cargar los métodos de pago.");

            paymentDataRef.current = Array.isArray(data) ? data : [];

            if (paymentSelectRef.current) {
                paymentSelectRef.current.innerHTML = "";

                // Se añaden opciones
                for (const m of paymentDataRef.current) {
                    const opt = document.createElement("option");
                    opt.value = String(m.id_metodo);
                    opt.textContent = m.nombre;
                    if (m.id_metodo === 1) opt.selected = true; //default: efectivo
                    paymentSelectRef.current.appendChild(opt);
                }
            }
            if (paymentWrapRef.current) paymentWrapRef.current.classList.remove("hidden");
        } catch (e) {
            showMessage(e.message || "Error cargando métodos de pago.", "error");
        }
    };

    // Registrar cliente
    const onRegistrarCliente = async (e) => {
        e.preventDefault();
        clearMessage();

        const cedula = (clientIdRef.current?.value || "").trim();
        const nombre = (clientNameRef.current?.value || "").trim();
        const email = (clientEmailRef.current?.value || "").trim();

        if (!cedula || !nombre || !email) {
            return showMessage("Ingrese cédula, nombre y correo electrónico.", "error");
        }

        try {
            const res = await fetch("/api/work_functions/client_register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ cedula, email, nombre }),
            });

            const data = await res.json().catch(() => ({}));
            const client = Array.isArray(data) ? data[0] : data;

            if (!res.ok) {
                const errMsg = client?.error || "Error registrando/validando cliente";
                throw new Error(errMsg);
            }

            const dbEmail = (client?.email ?? "").trim();
            const dbNombre = (client?.nombre ?? "").trim();

            if (dbEmail && dbEmail.toLowerCase() !== email.toLowerCase()) {
                return showMessage("La cédula ya existe con OTRO email.", "error");
            }
            if (dbNombre && dbNombre.toLowerCase() !== nombre.toLowerCase()) {
                return showMessage("La cédula ya existe con OTRO nombre.", "error");
            }

            // Habilitar producto
            isClientRegistered.current = true;
            if (productIdRef.current) productIdRef.current.disabled = false;
            if (quantityRef.current) quantityRef.current.disabled = false;
            const btn = document.getElementById("btn-add-line");
            if (btn) btn.disabled = false;

            showMessage("Cliente listo. Añade productos.");
        } catch (e2) {
            showMessage(e2.message || "Error registrando cliente", "error");
        }
    };

    // Añadir línea de producto (valida existencia y stock)
    const onAddLine = async (e) => {
        e.preventDefault();
        clearMessage();

        if (!isClientRegistered.current) {
            return showMessage("Registra el cliente primero.", "error");
        }

        const productId = (productIdRef.current?.value || "").trim();
        const quantity = Number(quantityRef.current?.value || 0);

        if (!productId || Number.isNaN(quantity) || quantity <= 0) {
            return showMessage("Complete el ID del producto y una cantidad válida (>0).", "error");
        }

        try {
            const res = await fetch("/api/work_functions/validate_product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_producto: parseInt(productId, 10),
                    cantidad: quantity,
                }),
            });

            const json = await res.json();

            if (!res.ok || !json?.ok) {
                if (json?.error === "PRODUCT_NOT_FOUND") {
                    return showMessage("El producto no existe.", "error");
                }
                if (json?.error === "INSUFFICIENT_STOCK") {
                    return showMessage(`Stock insuficiente. Disponible: ${json?.stock ?? 0}`, "error");
                }
                return showMessage(json?.error || "No se pudo validar el producto.", "error");
            }

            // OK = agregar
            orderLinesRef.current.push({
                productId,
                quantity,
                name: json.nombre,
            });

            // Limpiar inputs producto
            if (productIdRef.current) productIdRef.current.value = "";
            if (quantityRef.current) quantityRef.current.value = "1";

            renderSummary();

            // Si es el primer producto, mostrar selector de pago
            if (orderLinesRef.current.length === 1) {
                await ensurePaymentSelector();
            }
        } catch (err) {
            return showMessage(err.message || "Error validando producto.", "error");
        }
    };

    // Generar factura
    const onGenerarFactura = async () => {
        clearMessage();

        if (!isClientRegistered.current) {
            return showMessage("Registra el cliente primero.", "error");
        }
        if (orderLinesRef.current.length === 0) {
            return showMessage("Añade al menos un producto.", "error");
        }

        const methodSelected = paymentSelectRef.current?.value || "";
        const paymentMethodId = parseInt(methodSelected, 10);
        if (!paymentMethodId) {
            return showMessage("Selecciona un método de pago.", "error");
        }

        const clientId = parseInt(clientIdRef.current?.value, 10);

        try {
            const productIds = orderLinesRef.current.map((l) => parseInt(l.productId, 10));
            const quantities = orderLinesRef.current.map((l) => parseInt(l.quantity, 10));

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

            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                const errMsg = json?.error || "Error registrando la venta";
                throw new Error(errMsg);
            }

            showMessage("Factura generada correctamente", "ok");

            // Limpiar todo
            if (clientIdRef.current) clientIdRef.current.value = "";
            if (clientNameRef.current) clientNameRef.current.value = "";
            if (clientEmailRef.current) clientEmailRef.current.value = "";

            if (productIdRef.current) {
                productIdRef.current.value = "";
                productIdRef.current.disabled = true;
            }
            if (quantityRef.current) {
                quantityRef.current.value = "1";
                quantityRef.current.disabled = true;
            }

            const btn = document.getElementById("btn-add-line");
            if (btn) btn.disabled = true;

            orderLinesRef.current = [];
            isClientRegistered.current = false;
            setEmptySummary();

            // Ocultar selector de pago y limpiar
            if (paymentWrapRef.current) paymentWrapRef.current.classList.add("hidden");
            if (paymentSelectRef.current) paymentSelectRef.current.value = "";
            paymentDataRef.current = [];
        } catch (e) {
            showMessage(e.message || "Error generando factura", "error");
        }
    };

    return (
        <div className="min-h-screen bg-yellow-200 text-black p-6 ">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 ">
                {/* Izquierda */}
                <div className="lg:col-span-2 space-y-6 ">
                    {/* Cliente */}
                    <div className="border rounded-2xl p-5 shadow-sm bg-gray-600 text-white">
                        <h2 className="text-2xl font-bold mb-4">Cliente</h2>
                        <form onSubmit={onRegistrarCliente} className="space-y-3">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Cédula</label>
                                <input
                                    ref={clientIdRef}
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
                                    placeholder="ej. 1012345678"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Nombre</label>
                                <input
                                    ref={clientNameRef}
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
                                    placeholder="ej. Juan Pérez"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Email</label>
                                <input
                                    ref={clientEmailRef}
                                    type="email"
                                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
                                    placeholder="cliente@gmail.com"
                                />
                            </div>
                            <button className="px-4 py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 font-semibold cursor-pointer transition-colors duration-200 ease-in-out mb-3">
                                Ingresar cliente
                            </button>
                        </form>
                        <span> Debes agregar el cliente para poder añadir productos.</span>
                    </div>

                    {/* Producto */}
                    <div className="border rounded-2xl p-5 shadow-sm bg-gray-600 text-white">
                        <h2 className="text-2xl font-bold mb-4">Producto</h2>
                        <form onSubmit={onAddLine} className="space-y-3">
                            <div>
                                <label className="block text-sm font-semibold mb-1">ID Producto</label>
                                <input
                                    ref={productIdRef}
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
                                    placeholder="ej. 10"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Cantidad</label>
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
                <div className="lg:col-span-1 border rounded-2xl p-5 shadow-sm bg-gray-600 text-white w-130">
                    <h2 className="text-2xl font-bold mb-4">Cuenta</h2>
                    <p
                        ref={summaryRef}
                        className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-lg min-h-[220px] text-black"
                    >
                        No se agregaron productos.
                    </p>

                    {/* Selector de método de pago */}
                    <div ref={paymentWrapRef} className="hidden mt-3">
                        <label className="block text-sm font-semibold mb-1 text-white">
                            Método de pago
                        </label>
                        <select
                            ref={paymentSelectRef}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
                            defaultValue=""
                        >
                            {/* Opciones de pago */}
                        </select>
                    </div>

                    <button
                        onClick={onGenerarFactura}
                        className="mt-4 w-full py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 font-semibold cursor-pointer transition-colors duration-200 ease-in-out"
                        type="button"
                    >
                        Generar factura
                    </button>

                    {/* Mensajes (se limpian solos en 5s) */}
                    <div ref={messageRef} className="text-2xl mt-5"></div>
                </div>
            </div>
        </div>
    );
}
