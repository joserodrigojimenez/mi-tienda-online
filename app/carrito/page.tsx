"use client"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { CartButton } from "@/components/cart-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft } from "lucide-react"

export default function CartPage() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
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
                <Button variant="default" className="font-serif">
                  Carrito
                </Button>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-bold mb-4">Tu carrito está vacío</h2>
            <p className="text-muted-foreground mb-8">Agrega algunos productos para comenzar tu compra</p>
            <Button asChild>
              <Link href="/productos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuar comprando
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <Link href="/productos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar comprando
            </Link>
          </Button>
          <h2 className="text-3xl font-serif font-bold">Carrito de Compras</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.productId}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.product.imageUrl || "/placeholder.svg?height=96&width=96"}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <h3 className="font-serif font-semibold text-lg">{item.product.name}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{item.product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{formatPrice(item.product.price)}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            max={item.product.stock}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, Number.parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.productId)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">
                          Subtotal: {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="font-serif">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Productos ({state.totalItems})</span>
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

                <div className="space-y-2">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">Proceder al Pago</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                    Vaciar Carrito
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  <p>Envío gratuito en pedidos superiores a 50€</p>
                  <p>Devoluciones gratuitas en 30 días</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
