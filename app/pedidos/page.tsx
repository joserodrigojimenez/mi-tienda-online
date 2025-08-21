"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getOrders } from "@/lib/orders"
import type { Order } from "@/lib/types"
import { CartButton } from "@/components/cart-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Package, Clock, Truck, CheckCircle, X, Eye } from "lucide-react"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const fetchOrders = async () => {
    try {
      const ordersData = await getOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error("Error fetching orders:", error)
      // Fallback to mock data for demo
      setOrders(mockOrders)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const getStatusInfo = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return { icon: Clock, label: "Pendiente", variant: "secondary" as const, color: "text-yellow-600" }
      case "processing":
        return { icon: Package, label: "Procesando", variant: "default" as const, color: "text-blue-600" }
      case "shipped":
        return { icon: Truck, label: "Enviado", variant: "outline" as const, color: "text-purple-600" }
      case "delivered":
        return { icon: CheckCircle, label: "Entregado", variant: "default" as const, color: "text-green-600" }
      case "cancelled":
        return { icon: X, label: "Cancelado", variant: "destructive" as const, color: "text-red-600" }
      default:
        return { icon: Clock, label: "Desconocido", variant: "secondary" as const, color: "text-gray-600" }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-serif font-bold text-foreground">OrderFlow</h1>
              <nav className="flex items-center gap-4">
                <Button variant="ghost" className="font-serif" asChild>
                  <Link href="/">Inicio</Link>
                </Button>
                <Button variant="ghost" className="font-serif" asChild>
                  <Link href="/productos">Productos</Link>
                </Button>
                <Button variant="default" className="font-serif">
                  Pedidos
                </Button>
                <CartButton />
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando pedidos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-bold text-foreground">OrderFlow</h1>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" className="font-serif" asChild>
                <Link href="/">Inicio</Link>
              </Button>
              <Button variant="ghost" className="font-serif" asChild>
                <Link href="/productos">Productos</Link>
              </Button>
              <Button variant="default" className="font-serif">
                Pedidos
              </Button>
              <CartButton />
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Mis Pedidos</h2>
          <p className="text-muted-foreground">Gestiona y realiza seguimiento de todos tus pedidos</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por ID de pedido, nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="processing">Procesando</SelectItem>
              <SelectItem value="shipped">Enviado</SelectItem>
              <SelectItem value="delivered">Entregado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-serif font-semibold mb-2">No se encontraron pedidos</h3>
            <p className="text-muted-foreground mb-8">
              {orders.length === 0
                ? "Aún no has realizado ningún pedido"
                : "No hay pedidos que coincidan con tu búsqueda"}
            </p>
            <Button asChild>
              <Link href="/productos">Explorar Productos</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              const StatusIcon = statusInfo.icon

              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="font-serif text-lg">Pedido #{order.id.slice(-8)}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {order.createdAt.toDate().toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/pedido-confirmado/${order.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Order Items Preview */}
                    <div className="space-y-3">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.productId} className="flex gap-3">
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={item.product.imageUrl || "/placeholder.svg?height=48&width=48"}
                              alt={item.product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-1">{item.product.name}</h4>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>Cantidad: {item.quantity}</span>
                              <span>{formatPrice(item.product.price * item.quantity)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{order.items.length - 3} producto{order.items.length - 3 !== 1 ? "s" : ""} más
                        </p>
                      )}
                    </div>

                    <Separator />

                    {/* Order Summary */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Entregar a:</p>
                        <p className="text-sm font-medium">{order.customerInfo.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{order.customerInfo.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total del pedido</p>
                        <p className="text-lg font-bold text-primary">{formatPrice(order.totalAmount)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Order Statistics */}
        {orders.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { status: "pending", label: "Pendientes" },
              { status: "processing", label: "Procesando" },
              { status: "shipped", label: "Enviados" },
              { status: "delivered", label: "Entregados" },
              { status: "cancelled", label: "Cancelados" },
            ].map(({ status, label }) => {
              const count = orders.filter((order) => order.status === status).length
              const statusInfo = getStatusInfo(status as Order["status"])
              const StatusIcon = statusInfo.icon

              return (
                <Card key={status} className="text-center">
                  <CardContent className="p-4">
                    <StatusIcon className={`h-6 w-6 mx-auto mb-2 ${statusInfo.color}`} />
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Mock data for demo purposes
const mockOrders: Order[] = [
  {
    id: "order_1234567890",
    items: [
      {
        productId: "1",
        product: {
          id: "1",
          name: "Laptop Gaming Pro",
          description: "Laptop de alto rendimiento para gaming y trabajo profesional",
          price: 1299.99,
          stock: 15,
          category: "Electrónicos",
          imageUrl: "/gaming-laptop.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        quantity: 1,
      },
      {
        productId: "3",
        product: {
          id: "3",
          name: "Auriculares Inalámbricos",
          description: "Auriculares con cancelación de ruido y 30h de batería",
          price: 199.99,
          stock: 50,
          category: "Audio",
          imageUrl: "/wireless-headphones.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        quantity: 2,
      },
    ],
    totalAmount: 1699.97,
    status: "delivered",
    customerInfo: {
      name: "Juan Pérez",
      email: "juan@example.com",
      phone: "+34 600 123 456",
      address: "Calle Mayor 123, 28001 Madrid, España",
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "order_0987654321",
    items: [
      {
        productId: "2",
        product: {
          id: "2",
          name: "Smartphone Ultra",
          description: "Teléfono inteligente con cámara de 108MP y 5G",
          price: 899.99,
          stock: 25,
          category: "Electrónicos",
          imageUrl: "/modern-smartphone.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        quantity: 1,
      },
    ],
    totalAmount: 899.99,
    status: "shipped",
    customerInfo: {
      name: "María García",
      email: "maria@example.com",
      phone: "+34 600 987 654",
      address: "Avenida de la Paz 456, 08001 Barcelona, España",
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "order_1122334455",
    items: [
      {
        productId: "5",
        product: {
          id: "5",
          name: "Teclado Mecánico",
          description: "Teclado mecánico RGB para gaming y programación",
          price: 129.99,
          stock: 30,
          category: "Accesorios",
          imageUrl: "/mechanical-keyboard.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        quantity: 1,
      },
      {
        productId: "6",
        product: {
          id: "6",
          name: "Mouse Gaming",
          description: "Mouse óptico de alta precisión con 12000 DPI",
          price: 79.99,
          stock: 40,
          category: "Accesorios",
          imageUrl: "/gaming-mouse.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        quantity: 1,
      },
    ],
    totalAmount: 209.98,
    status: "processing",
    customerInfo: {
      name: "Carlos López",
      email: "carlos@example.com",
      address: "Plaza España 789, 41001 Sevilla, España",
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
]
