[README.md](https://github.com/user-attachments/files/21925917/README.md)
# App de Gestión de Pedidos Online (Ionic React + Firebase Firestore)

## Objetivo
Aplicación híbrida multiplataforma para gestionar productos, carrito de compras y pedidos con conexión a **Firebase Firestore**.

---

## 🚀 Características principales
- Catálogo de productos con nombre, descripción, precio y stock.
- Carrito de compras con manejo de estado local.
- Creación de pedidos (CRUD + transacción que descuenta stock).
- Historial de pedidos por usuario (Auth anónima).
- Compatible con Android e iOS (Capacitor).

---

## 📦 Requisitos
- Node.js 18+
- Ionic CLI (`npm i -g @ionic/cli`)
- Firebase (Firestore + Authentication habilitada en modo anónimo)
- Android Studio / Xcode (para compilar nativo)

---

## ⚙️ Instalación y configuración
1. Clonar este repositorio
   ```bash
   git clone https://github.com/TU_USUARIO/TU_REPO.git
   cd TU_REPO
   npm install
   ```
2. Configurar Firebase en `src/firebase.ts` con tus credenciales.
3. Activar **Auth anónima** en Firebase Console.
4. Definir reglas de seguridad Firestore (archivo `firestore.rules`).

---

## 📂 Estructura de datos en Firestore
- **products**:  
  ```json
  {
    "name": "Café Americano",
    "description": "8 oz",
    "price": 12.5,
    "stock": 20
  }
  ```

- **orders**:  
  ```json
  {
    "userId": "UID_DEL_USUARIO",
    "items": [
      { "productId": "123", "name": "Café Americano", "price": 12.5, "qty": 2 }
    ],
    "status": "pending",
    "createdAt": "timestamp"
  }
  ```

---

## ▶️ Scripts útiles
- `ionic serve` → Modo desarrollo en navegador
- `ionic build && ionic cap sync` → Prepara app nativa
- `ionic cap open android` → Abre en Android Studio
- `ionic cap open ios` → Abre en Xcode

---

## 📱 Flujo de la aplicación
1. El usuario visualiza la lista de productos desde Firestore.
2. Añade productos al carrito (estado local Context API).
3. Realiza un pedido → se descuenta el stock en Firestore y se guarda el pedido.
4. Puede ver su historial de pedidos filtrado por su UID.

---

## ✅ Cumplimiento de la actividad
- Catálogo de productos ✅  
- Carrito de compras ✅  
- Gestión de pedidos (CRUD + transacciones) ✅  
- Base de datos remota (Firestore) ✅  
- Comportamiento consistente Android/iOS ✅  

---

## 📹 Entrega opcional
- Graba un video corto mostrando el flujo: agregar productos, realizar pedido y consultar historial.

---

© 2025 - App de Gestión de Pedidos Online
