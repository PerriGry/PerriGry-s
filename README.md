# 🚀 Proyecto API con Next.js + PostgreSQL

Este proyecto implementa una **REST API** con **Next.js (App Router)** y **PostgreSQL 17** desplegado en **Neon DB**.  
El objetivo principal es gestionar un sistema básico con funcionalidades de autenticación y operaciones comerciales.

---

## 🛠 Tecnologías utilizadas
- [Next.js 14](https://nextjs.org/) – Framework React para frontend y backend.
- [PostgreSQL 17](https://www.postgresql.org/) – Base de datos relacional.
- [Neon DB](https://neon.tech/) – Base de datos PostgreSQL en la nube.
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) – Hash de contraseñas.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) – Manejo de JWT para autenticación.
- [dotenv](https://www.npmjs.com/package/dotenv) – Variables de entorno.

---

## ⚙️ Configuración del proyecto

### 1️⃣ Clonar repositorio
```bash
git clone https://github.com/usuario/mi-proyecto.git
cd mi-proyecto
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Variables de entorno
Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://usuario:password@host:5432/database
JWT_SECRET=tu_secreto_jwt
```

> ⚠️ La base de datos debe estar creada previamente en **Neon DB**.

### 4️⃣ Levantar el servidor
```bash
npm run dev
```

La API quedará disponible en `http://localhost:3000/api`.

---

## 📂 Estructura de directorios

```
src/
 ├─ app/
 │   ├─ api/
 │   │   ├─ auth/
 │   │   │   └─ login/route.js
 │   │   ├─ users/route.js
 │   │   ├─ products/route.js
 │   │   ├─ sales/
 │   │   │   └─ sale_register/route.js
 │   │   └─ reports/total_sales/route.js
 │   ├─ middleware.js
 │   └─ page.js
 ├─ lib/
 │   └─ db.js
 └─ services/
     ├─ auth.service.js
     ├─ work_functions.service.js
     └─ product.service.js
```

---

## 📌 Endpoints principales

### 🔑 Autenticación
- `POST /api/auth/login` → Login de usuario con **JWT + Cookie HTTPOnly**.

### 👥 Usuarios
- `POST /api/users` → Registrar empleado.  
- `GET /api/users` → Listar todos los usuarios.

### 📦 Productos
- `POST /api/products` → Registrar productos.  
- `GET /api/products` → Listar productos.

### 💰 Ventas
- `POST /api/work_functions/sale_register` → Registrar una venta (requiere **JWT**).  
- `GET /api/reports/total_sales` → Consultar ventas totales.

---

## 🔒 Seguridad

- **JWT (JSON Web Tokens)**: usado para sesiones seguras.  
- **Cookies HTTPOnly**: protegen el token en el navegador.  
- **Middleware** en `src/app/middleware.js` verifica el token en rutas protegidas.

---

## 🎯 Funcionalidades del proyecto
- ✅ Registro de empleados (usuarios).  
- ✅ Registro de productos.  
- ✅ Login con JWT y cookies seguras.  
- ✅ Registro de ventas con validación de token.  
- ✅ Consulta de ventas totales.  

---

## 🚀 Deploy
- Base de datos desplegada en [Neon DB](https://neon.tech/).  

---
