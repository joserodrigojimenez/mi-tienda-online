"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { CartSidebar } from "@/components/cart-sidebar"

export function CartButton() {
  const { state } = useCart()
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <>
      <Button variant="outline" size="sm" className="relative bg-transparent" onClick={() => setShowSidebar(true)}>
        <ShoppingCart className="h-4 w-4" />
        {state.totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {state.totalItems}
          </span>
        )}
      </Button>

      <CartSidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
    </>
  )
}
