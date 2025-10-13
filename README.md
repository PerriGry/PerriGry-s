
<p align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original-wordmark.svg" width="120" alt="Next.js Logo"/>
</p>

<h1 align="center">🚀 Perrigry-S</h1>

<p align="center">
  <b>Software de gestión para empleados y administradores de tienda, desarrollado con <b>Next.js + PostgreSQL + MongoDB Atlas</b>. Permite administrar usuarios, ventas y autenticación mediante reconocimiento facial.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Estado-En%20Desarrollo-yellow?style=for-the-badge&logo=github&logoColor=black"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
</p>

---

## 🛠 Tecnologías utilizadas

* **Next.js 15** – Framework para frontend y backend con App Router.
* **PostgreSQL 17** – Base de datos relacional para ventas y usuarios.
* **MongoDB Atlas** – Base de datos NoSQL para almacenamiento de vectores faciales.
* **bcryptjs** – Hash de contraseñas.
* **jsonwebtoken (JWT)** – Autenticación segura.
* **dotenv** – Variables de entorno.
* **@tensorflow/tfjs & @vladmandic/face-api** – Reconocimiento facial.

---

## ⚙️ Configuración del proyecto

### 1️⃣ Clonar repositorio

```bash
git clone https://github.com/usuario/perrigry-s.git
cd perrigry-s
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://usuario:password@host:5432/database
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/dbname
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=tiempo_init
JWT_SECRET_INIT=tu_secreto_init
JWT_EXPIRES_INIT=tiempo_init
```

> ⚠️ Asegúrate de que las bases de datos estén creadas previamente en **NeonDB** y **Mongo Atlas**.

### 4️⃣ Levantar el servidor

```bash
npm run dev
```

API disponible en `http://localhost:3000/api`.

## 📂 Estructura de directorios (Backend)

```
src/
 ├─ app/
 │   ├─ api/
 │   │   ├─ auth/
 │   │   │   ├─ faceRegister/route.js
 │   │   │   ├─ faceReturn/route.js
 │   │   │   ├─ register/route.js
 │   │   │   └─ login/
 │   │   │       └─ loginFace/route.js
 │   │   ├─ work_functions/
 │   │   │   ├─ client_register/route.js
 │   │   │   ├─ sale_register/route.js
 │   │   │   ├─ statistics/route.js
 │   │   │   ├─ validate_product/route.js
 │   │   │   └─ payment_methods/route.js
 │   ├─ middleware.js
 │   └─ page.js
 ├─ lib/
 │   ├─ db.js       # Conexión a NeonDB (PostgreSQL)
 │   └─ dbmongo.js  # Conexión a Mongo Atlas
 └─ services/
     ├─ auth.service.js
     ├─ mongo.service.js
     └─ work_functions.service.js
 └─ public/
     └─ models/     # Modelos de reconocimiento facial
```

---

## 📌 Endpoints principales

### 🔑 Autenticación (`/auth`)

| Endpoint           | Método | Descripción                                    | Protegido |
| ------------------ | ------ | ---------------------------------------------- | --------- |
| `/faceRegister`    | POST   | Registrar rostros, email y rol en MongoDB      | No        |
| `/faceReturn`      | GET    | Retornar vectores faciales por email           | Sí        |
| `/register`        | POST   | Registrar usuario (Empleado o Administrador)   | No        |
| `/login`           | POST   | Primera fase de login                          | No        |
| `/login/loginFace` | POST   | Segunda fase login facial (tras login inicial) | Sí        |

### 💼 Funciones de trabajo (`/work_functions`)

| Endpoint            | Método | Descripción                        | Protegido |
| ------------------- | ------ | ---------------------------------- | --------- |
| `/client_register`  | POST   | Registrar cliente                  | No        |
| `/sale_register`    | POST   | Registrar venta                    | Sí        |
| `/statistics`       | GET    | Ver ventas totales (mejora futura) | Sí        |
| `/validate_product` | POST   | Validar productos y stock          | No        |
| `/payment_methods`  | GET    | Visualizar métodos de pago         | No        |

---

## 🔒 Seguridad

* **JWT (JSON Web Tokens)**: sesiones seguras.
* **Cookies HTTPOnly**: protegen el token en el navegador.
* **Middleware** (`src/app/middleware.js`) verifica autenticación y protege rutas.

---

## 🎯 Funcionalidades

* ✅ Registro de empleados y administradores.
* ✅ Registro de clientes y ventas.
* ✅ Login seguro con JWT y cookies HTTPOnly.
* ✅ Registro y validación de productos.
* ✅ Reconocimiento facial con almacenamiento de vectores en MongoDB.
* ✅ Consulta de ventas totales (posible mejora futura).

---

## 🌐 Deploy

* Bases de datos desplegadas en **NeonDB (PostgreSQL)** y **Mongo Atlas**.

---

## 👨‍💻👩‍💻 Autoras y Autores

<p align="center">
  <a href="https://github.com/bskcfv" target="_blank">
    <img src="https://github.com/bskcfv.png" width="80" alt="Cristian Valderrama" style="border-radius:50%; margin: 0 10px;"/>
  </a>
  <a href="https://github.com/Cardeniu" target="_blank">
    <img src="https://github.com/Cardeniu.png" width="80" alt="Juan Cardenas" style="border-radius:50%; margin: 0 10px;"/>
  </a>
  <a href="https://github.com/Pabs0-0" target="_blank">
    <img src="https://github.com/Pabs0-0.png" width="80" alt="Paula Barbosa" style="border-radius:50%; margin: 0 10px;"/>
  </a>
</p>

<p align="center">
  <b><a href="https://github.com/bskcfv" target="_blank">Cristian Valderrama</a></b> – Encargado del Backend y bases de datos<br/>
  <b><a href="https://github.com/Cardeniu" target="_blank">Juan Cardenas</a></b> – Encargado del Frontend<br/>
  <b><a href="https://github.com/Pabs0-0" target="_blank">Paula Barbosa</a></b> – Encargada del Frontend y Mockups
</p>
