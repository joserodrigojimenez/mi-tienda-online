"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { state, updateQuantity, removeFromCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-serif flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito ({state.totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Tu carrito está vacío</p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {state.items.map((item) => (
                  <div key={item.productId} className="flex gap-3 p-3 border rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product.imageUrl || "/placeholder.svg?height=64&width=64"}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                      <p className="text-primary font-semibold text-sm">{formatPrice(item.product.price)}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 bg-transparent"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm px-2">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 bg-transparent"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-lg font-bold text-primary">{formatPrice(state.totalAmount)}</span>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" asChild onClick={onClose}>
                    <Link href="/carrito">Ver Carrito Completo</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild onClick={onClose}>
                    <Link href="/productos">Seguir Comprando</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
