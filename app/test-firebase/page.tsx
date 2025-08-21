"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"

console.log("[v0] Test Firebase page is loading...")

const firebaseConfig = {
  apiKey: "AIzaSyAeHxJ1fH27yOHoJehxq3jYw9jgPlXrN7w",
  authDomain: "mi-tienda-online-c45b6.firebaseapp.com",
  projectId: "mi-tienda-online-c45b6",
  storageBucket: "mi-tienda-online-c45b6.firebasestorage.app",
  messagingSenderId: "392574657210",
  appId: "1:392574657210:web:9fc201687fba8c7fc19883",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const sampleProducts = [
  {
    name: "Laptop Gaming Pro",
    description: "Laptop de alto rendimiento para gaming y trabajo profesional",
    price: 1299.99,
    stock: 15,
    category: "Electrónicos",
    image: "/gaming-laptop.png",
  },
  {
    name: "Smartphone Moderno",
    description: "Teléfono inteligente con cámara avanzada y batería de larga duración",
    price: 699.99,
    stock: 25,
    category: "Electrónicos",
    image: "/modern-smartphone.png",
  },
  {
    name: "Auriculares Inalámbricos",
    description: "Auriculares Bluetooth con cancelación de ruido activa",
    price: 199.99,
    stock: 30,
    category: "Audio",
    image: "/wireless-headphones.png",
  },
]

export default function TestFirebasePage() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  console.log("[v0] TestFirebasePage component is rendering...")

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testConnection = async () => {
    setIsLoading(true)
    addLog("🔥 Probando conexión a Firebase...")

    try {
      // Test writing to Firestore
      const testDoc = await addDoc(collection(db, "test"), {
        message: "Conexión exitosa!",
        timestamp: new Date(),
      })

      addLog(`✅ Documento de prueba creado con ID: ${testDoc.id}`)

      // Test reading from Firestore
      const querySnapshot = await getDocs(collection(db, "test"))
      addLog(`✅ Documentos encontrados: ${querySnapshot.size}`)
      addLog("🎉 ¡Firebase está configurado correctamente!")
    } catch (error: any) {
      addLog(`❌ Error conectando a Firebase: ${error.message}`)

      if (error.message.includes("Missing or insufficient permissions")) {
        addLog("💡 Solución: Ve a Firebase Console → Firestore Database → Reglas")
        addLog("💡 Cambia las reglas a: allow read, write: if true;")
      }
    }

    setIsLoading(false)
  }

  const seedProducts = async () => {
    setIsLoading(true)
    addLog("🌱 Añadiendo productos de ejemplo...")

    try {
      for (const product of sampleProducts) {
        const docRef = await addDoc(collection(db, "products"), {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        addLog(`✅ Producto añadido: ${product.name} (ID: ${docRef.id})`)
      }

      addLog("🎉 ¡Todos los productos han sido añadidos exitosamente!")
    } catch (error: any) {
      addLog(`❌ Error añadiendo productos: ${error.message}`)
    }

    setIsLoading(false)
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prueba de Firebase</h1>
        <p className="text-gray-600">Prueba la conexión y añade productos de ejemplo a tu base de datos</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Probar Conexión</CardTitle>
            <CardDescription>Verifica que Firebase esté configurado correctamente</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testConnection} disabled={isLoading} className="w-full">
              {isLoading ? "Probando..." : "Probar Conexión"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Añadir Productos</CardTitle>
            <CardDescription>Añade productos de ejemplo a tu base de datos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={seedProducts}
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isLoading ? "Añadiendo..." : "🌱 Añadir Productos"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Registro de Actividad</CardTitle>
            <CardDescription>Resultados de las pruebas y operaciones</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={clearLogs}>
            Limpiar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay registros aún...</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
