"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart, Minus, Plus } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

interface ProductModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    onClose()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.imageUrl || "/placeholder.svg?height=400&width=400"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-4">{product.description}</p>

              <div className="flex items-center gap-2 mb-4">
                {product.category && <Badge variant="outline">{product.category}</Badge>}
                {product.stock <= 5 && product.stock > 0 && <Badge variant="destructive">Pocas unidades</Badge>}
                {product.stock === 0 && <Badge variant="secondary">Agotado</Badge>}
              </div>

              <div className="text-3xl font-bold text-primary mb-2">{formatPrice(product.price)}</div>

              <p className="text-sm text-muted-foreground mb-4">Stock disponible: {product.stock} unidades</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={decrementQuantity} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Math.min(product.stock, Number.parseInt(e.target.value) || 1)))
                  }
                  className="w-20 text-center"
                />
                <Button variant="outline" size="sm" onClick={incrementQuantity} disabled={quantity >= product.stock}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Total Price */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(product.price * quantity)}</span>
              </div>

              <Button className="w-full" onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar al carrito
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
