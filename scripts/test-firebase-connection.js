import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"

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

async function testConnection() {
  try {
    console.log("🔥 Probando conexión a Firebase...")

    // Test writing to Firestore
    const testDoc = await addDoc(collection(db, "test"), {
      message: "Conexión exitosa!",
      timestamp: new Date(),
    })

    console.log("✅ Documento de prueba creado con ID:", testDoc.id)

    // Test reading from Firestore
    const querySnapshot = await getDocs(collection(db, "test"))
    console.log("✅ Documentos encontrados:", querySnapshot.size)

    console.log("🎉 ¡Firebase está configurado correctamente!")
  } catch (error) {
    console.error("❌ Error conectando a Firebase:", error.message)

    if (error.message.includes("Missing or insufficient permissions")) {
      console.log("💡 Solución: Ve a Firebase Console → Firestore Database → Reglas")
      console.log("💡 Cambia las reglas a: allow read, write: if true;")
    }
  }
}

testConnection()
