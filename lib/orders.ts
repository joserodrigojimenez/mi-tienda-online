import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Order, CartItem } from "@/lib/types"

export async function createOrder(orderData: {
  items: CartItem[]
  totalAmount: number
  customerInfo: {
    name: string
    email: string
    phone?: string
    address: string
  }
}): Promise<string> {
  try {
    const order: Omit<Order, "id"> = {
      ...orderData,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await addDoc(collection(db, "orders"), order)
    return docRef.id
  } catch (error) {
    console.error("Error creating order:", error)
    throw new Error("Failed to create order")
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    const orders: Order[] = []

    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order)
    })

    return orders
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<void> {
  try {
    const orderRef = doc(db, "orders", orderId)
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    throw new Error("Failed to update order status")
  }
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  try {
    const q = query(collection(db, "orders"), where("customerInfo.email", "==", email), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    const orders: Order[] = []

    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order)
    })

    return orders
  } catch (error) {
    console.error("Error fetching orders by email:", error)
    return []
  }
}
