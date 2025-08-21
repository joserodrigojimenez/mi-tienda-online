"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product } from "@/lib/types"
import { ProductCard } from "@/components/product-card"
import { CartButton } from "@/components/cart-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import Link from "next/link"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"))
      const productsData: Product[] = []
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product)
      })
      setProducts(productsData)
    } catch (error) {
      console.error("Error fetching products:", error)
      // Fallback to mock data for demo
      setProducts(mockProducts)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }

  const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)))

  const seedDatabase = async () => {
    setSeeding(true)
    try {
      console.log("[v0] Starting to seed database with sample products...")
      const productsCollection = collection(db, "products")

      for (const product of mockProducts) {
        const { id, ...productData } = product // Remove id since Firestore will generate it
        await addDoc(productsCollection, productData)
        console.log("[v0] Added product:", product.name)
      }

      console.log("[v0] Database seeded successfully!")
      // Refresh products after seeding
      await fetchProducts()
    } catch (error) {
      console.error("[v0] Error seeding database:", error)
    } finally {
      setSeeding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando productos...</p>
            </div>
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
              <Button variant="default" className="font-serif">
                Productos
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
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Catálogo de Productos</h2>
          <p className="text-muted-foreground">Descubre nuestra selección de productos disponibles</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category || ""}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-6">No se encontraron productos</p>
            {products.length === 0 && (
              <Button
                onClick={seedDatabase}
                disabled={seeding}
                className="bg-orange-500 hover:bg-orange-600 text-white font-serif"
              >
                {seeding ? "Añadiendo productos..." : "🌱 Añadir Productos de Ejemplo"}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Mock data for demo purposes
const mockProducts: Product[] = [
  {
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
  {
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
  {
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
  {
    id: "4",
    name: "Monitor 4K",
    description: "Monitor profesional 27 pulgadas con resolución 4K",
    price: 449.99,
    stock: 12,
    category: "Electrónicos",
    imageUrl: "/4k-monitor.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
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
  {
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
]
