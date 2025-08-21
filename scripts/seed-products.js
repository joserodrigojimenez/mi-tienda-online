import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Sample products to add
const sampleProducts = [
  {
    name: "Laptop Gaming Pro",
    description: "Laptop de alto rendimiento para gaming y trabajo profesional",
    price: 1299.99,
    stock: 15,
    category: "Electrónicos",
    image: "/gaming-laptop.png",
    createdAt: new Date(),
  },
  {
    name: "Smartphone Moderno",
    description: "Teléfono inteligente con cámara de alta resolución",
    price: 699.99,
    stock: 25,
    category: "Electrónicos",
    image: "/modern-smartphone.png",
    createdAt: new Date(),
  },
  {
    name: "Auriculares Inalámbricos",
    description: "Auriculares con cancelación de ruido y sonido premium",
    price: 199.99,
    stock: 30,
    category: "Audio",
    image: "/wireless-headphones.png",
    createdAt: new Date(),
  },
  {
    name: "Tablet Pro",
    description: "Tablet profesional para diseño y productividad",
    price: 899.99,
    stock: 12,
    category: "Electrónicos",
    image: "/professional-tablet.png",
    createdAt: new Date(),
  },
  {
    name: "Smartwatch Deportivo",
    description: "Reloj inteligente con seguimiento de actividad física",
    price: 299.99,
    stock: 20,
    category: "Wearables",
    image: "/sports-smartwatch.png",
    createdAt: new Date(),
  },
]

async function seedProducts() {
  try {
    console.log("[v0] Iniciando la carga de productos...")

    for (const product of sampleProducts) {
      const docRef = await addDoc(collection(db, "products"), product)
      console.log("[v0] Producto añadido con ID:", docRef.id, "- Nombre:", product.name)
    }

    console.log("[v0] ✅ Todos los productos han sido añadidos exitosamente!")
  } catch (error) {
    console.error("[v0] ❌ Error al añadir productos:", error)
  }
}

// Ejecutar el script
seedProducts()
