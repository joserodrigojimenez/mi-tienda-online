import { ShoppingCart, Package, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CartButton } from "@/components/cart-button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-bold text-foreground">OrderFlow</h1>
            <nav className="flex items-center gap-4">
              <Button variant="default" className="font-serif" asChild>
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

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Gestión de Pedidos Online</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sistema completo para gestionar productos, pedidos y seguimiento de entregas. Diseñado para pequeñas y
            medianas empresas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-serif" asChild>
              <Link href="/productos">Ver Productos</Link>
            </Button>
            <Button variant="outline" size="lg" className="font-serif bg-transparent" asChild>
              <Link href="/pedidos">Mis Pedidos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-2xl font-serif font-bold text-center mb-8">Características Principales</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Package className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-serif">Catálogo de Productos</CardTitle>
                <CardDescription>
                  Gestiona tu inventario con información detallada de productos, precios y stock disponible.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingCart className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-serif">Carrito de Compras</CardTitle>
                <CardDescription>
                  Sistema intuitivo para agregar productos, modificar cantidades y procesar pedidos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-serif">Seguimiento de Pedidos</CardTitle>
                <CardDescription>
                  Monitorea el estado de tus pedidos desde la confirmación hasta la entrega.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 mt-12">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 OrderFlow. Sistema de gestión de pedidos online.</p>
        </div>
      </footer>
    </div>
  )
}
