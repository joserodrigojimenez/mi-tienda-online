# 🛒 Order Management App

Aplicación de **Gestión de Pedidos Online** desarrollada como proyecto académico.  
Permite visualizar un catálogo de productos, añadirlos al carrito, realizar pedidos y consultar el historial.

---

## 🚀 Tecnologías usadas
- **Frontend:** React (con Vite/CRA, según tu setup)
- **Backend / Base de datos remota:** Firebase Firestore
- **UI / Estilos:** TailwindCSS + Componentes personalizados
- **Gestión de estado:** Context API / Hooks de React

---

## ✨ Características principales
✅ Visualizar lista de productos con imagen, descripción, precio y stock  
✅ Carrito de compras con manejo de estado local  
✅ Registro de pedidos en **base de datos remota (Firestore)**  
✅ Historial de pedidos del usuario  
✅ Compatible con Android 📱 y iOS 🍏 (via PWA o empaquetado con Capacitor/Ionic)  
✅ CRUD completo sobre colecciones **Productos** y **Pedidos**  

---

## 📊 Modelo de Datos

### Colección: `Productos`
```json
{
  "id": "auto-generado",
  "nombre": "Laptop Gaming Pro",
  "descripcion": "Laptop de alto rendimiento para gaming y trabajo profesional",
  "precio": 1299.99,
  "stock": 15,
  "categoria": "Electrónicos",
  "imagen": "url"
}
```

### Colección: `Pedidos`
```json
{
  "id": "auto-generado",
  "usuarioId": "UID de Firebase",
  "productos": [
    {
      "productoId": "idProducto",
      "cantidad": 2
    }
  ],
  "estado": "pendiente",
  "fecha": "2025-08-21T15:30:00Z"
}
```

---

## 📦 Instalación y ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/order-management-app.git
cd order-management-app
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Configurar Firebase
Crea un proyecto en [Firebase Console](https://console.firebase.google.com/) y copia las credenciales.  
En tu proyecto, crea un archivo `.env` con algo así:

```env
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx
```

### 4️⃣ Ejecutar el proyecto
```bash
npm run dev
```

Abrir en `http://localhost:5173/`

---

## 🖼 Vista previa

### 📌 Catálogo de productos
![Productos](./screenshots/productos.png)

### 📌 Carrito de compras
![Carrito](./screenshots/carrito.png)

### 📌 Historial de pedidos
![Pedidos](./screenshots/pedidos.png)

---

## 📱 Multiplataforma
La app funciona como **PWA** y puede empaquetarse con **Capacitor** para Android/iOS:

```bash
npx cap add android
npx cap add ios
npx cap sync
```

---


