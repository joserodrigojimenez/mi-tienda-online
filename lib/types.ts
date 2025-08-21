// Type definitions for the order management system
export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  imageUrl?: string
  category?: string
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  productId: string
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  customerInfo: {
    name: string
    email: string
    phone?: string
    address: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface OrderStatus {
  status: Order["status"]
  timestamp: Date
  notes?: string
}
