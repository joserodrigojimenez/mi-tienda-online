"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Order } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { OrderStatusTracker } from "@/components/order-status-tracker"
import { CheckCircle, Package, Truck, Clock } from "lucide-react"
import { CartButton } from "@/components/cart-button"

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const orderDoc = await getDoc(doc(db, "orders", orderId))
      if (orderDoc.exists()) {
        setOrder({ id: orderDoc.id, ...orderDoc.data() } as Order)
      }
    } catch (error) {
      console.error("Error fetching order:", error)
    } finally {
      setLoading(false)
    }
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
        return { icon: Clock, label: "Pendiente", color: "bg-yellow-500" }
      case "processing":
        return { icon: Package, label: "Procesando", color: "bg-blue-500" }
      case "shipped":
        return { icon: Truck, label: "Enviado", color: "bg-purple-500" }
      case "delivered":
        return { icon: CheckCircle, label: "Entregado", color: "bg-green-500" }
      case "cancelled":
        return { icon: Clock, label: "Cancelado", color: "bg-red-500" }
      default:
        return { icon: Clock, label: "Desconocido", color: "bg-gray-500" }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando pedido...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
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
                <Button variant="ghost" className="font-serif" asChild>
                  <Link href="/pedidos">Pedidos</Link>
                </Button>
                <CartButton />
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold mb-4">Pedido no encontrado</h2>
            <p className="text-muted-foreground mb-8">El pedido que buscas no existe o ha sido eliminado</p>
            <Button asChild>
              <Link href="/productos">Ver Productos</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

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
              <Button variant="ghost" className="font-serif" asChild>
                <Link href="/pedidos">Pedidos</Link>
              </Button>
              <CartButton />
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">¡Pedido Confirmado!</h2>
          <p className="text-muted-foreground">
            Tu pedido #{orderId.slice(-8)} ha sido recibido y está siendo procesado
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <OrderStatusTracker status={order.status} createdAt={order.createdAt} updatedAt={order.updatedAt} />

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif">Detalles del Pedido</CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex gap-4 p-4 border rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product.imageUrl || "/placeholder.svg?height=64&width=64"}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">{item.product.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-muted-foreground">Cantidad: {item.quantity}</span>
                        <span className="font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Información de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">Nombre:</span> {order.customerInfo.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {order.customerInfo.email}
                </div>
                {order.customerInfo.phone && (
                  <div>
                    <span className="font-medium">Teléfono:</span> {order.customerInfo.phone}
                  </div>
                )}
                <div>
                  <span className="font-medium">Dirección:</span>
                  <p className="mt-1 text-muted-foreground">{order.customerInfo.address}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="font-serif">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium">Pedido:</span> #{orderId.slice(-8)}
                  </p>
                  <p>
                    <span className="font-medium">Fecha:</span> {order.createdAt.toDate().toLocaleDateString("es-ES")}
                  </p>
                  <p>
                    <span className="font-medium">Método de pago:</span> Contra reembolso
                  </p>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/pedidos">Ver Mis Pedidos</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/productos">Seguir Comprando</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
