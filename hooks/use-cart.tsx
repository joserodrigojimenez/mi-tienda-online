"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Product, CartItem } from "@/lib/types"

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  state: CartState
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.productId === action.payload.id)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.productId === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalAmount: state.totalAmount + action.payload.price,
        }
      } else {
        const newItem: CartItem = {
          productId: action.payload.id,
          product: action.payload,
          quantity: 1,
        }
        return {
          ...state,
          items: [...state.items, newItem],
          totalItems: state.totalItems + 1,
          totalAmount: state.totalAmount + action.payload.price,
        }
      }
    }

    case "REMOVE_ITEM": {
      const itemToRemove = state.items.find((item) => item.productId === action.payload)
      if (!itemToRemove) return state

      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.payload),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalAmount: state.totalAmount - itemToRemove.product.price * itemToRemove.quantity,
      }
    }

    case "UPDATE_QUANTITY": {
      const item = state.items.find((item) => item.productId === action.payload.productId)
      if (!item) return state

      const quantityDiff = action.payload.quantity - item.quantity
      const updatedItems = state.items.map((item) =>
        item.productId === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item,
      )

      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalAmount: state.totalAmount + item.product.price * quantityDiff,
      }
    }

    case "CLEAR_CART":
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0,
      }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalAmount: 0,
  })

  const addToCart = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product })
  }

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
