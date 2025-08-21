"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { ProductModal } from "@/components/product-modal"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <Image
              src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Pocas unidades
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary" className="absolute top-2 right-2">
                Agotado
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-serif font-semibold text-lg line-clamp-1">{product.name}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.category && (
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Stock: {product.stock} unidades</p>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 space-y-2">
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => setShowModal(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Ver
            </Button>
            <Button size="sm" className="flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ProductModal product={product} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
