"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { createOrder } from "@/lib/orders"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Truck } from "lucide-react"
import { CartButton } from "@/components/cart-button"

export default function CheckoutPage() {
  const { state, clearCart } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      alert("Por favor, completa todos los campos obligatorios")
      return
    }

    setIsProcessing(true)

    try {
      const orderId = await createOrder({
        items: state.items,
        totalAmount: state.totalAmount,
        customerInfo,
      })

      clearCart()
      router.push(`/pedido-confirmado/${orderId}`)
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Error al procesar el pedido. Por favor, inténtalo de nuevo.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (state.items.length === 0) {
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
            <h2 className="text-2xl font-serif font-bold mb-4">No hay productos en el carrito</h2>
            <p className="text-muted-foreground mb-8">Agrega algunos productos antes de proceder al checkout</p>
            <Button asChild>
              <Link href="/productos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ver Productos
              </Link>
            </Button>
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
              <Button variant="ghost" className="font-serif" asChild>
                <Link href="/pedidos">Pedidos</Link>
              </Button>
              <CartButton />
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/carrito">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al carrito
            </Link>
          </Button>
          <h2 className="text-3xl font-serif font-bold">Finalizar Pedido</h2>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Customer Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Información de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+34 600 000 000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección de envío *</Label>
                    <Textarea
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Calle, número, código postal, ciudad"
                      required
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Método de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      💳 Pago contra reembolso - Paga cuando recibas tu pedido
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="font-serif">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {state.items.map((item) => (
                      <div key={item.productId} className="flex gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={item.product.imageUrl || "/placeholder.svg?height=48&width=48"}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium line-clamp-1">{item.product.name}</h4>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">x{item.quantity}</span>
                            <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(state.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(state.totalAmount)}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? "Procesando..." : "Confirmar Pedido"}
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    <p>Al confirmar tu pedido, aceptas nuestros términos y condiciones</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
