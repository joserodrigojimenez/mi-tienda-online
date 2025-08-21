"use client"

import type React from "react"

import { useState } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addDoc(collection(db, "products"), {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        category: formData.category,
        image: formData.image || "/diverse-products-still-life.png",
        createdAt: new Date(),
      })

      toast.success("Producto añadido exitosamente!")
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: "",
      })
    } catch (error) {
      console.error("[v0] Error al añadir producto:", error)
      toast.error("Error al añadir el producto")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

        <Card>
          <CardHeader>
            <CardTitle>Añadir Nuevo Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Laptop Gaming Pro"
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Descripción detallada del producto"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="99.99"
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Electrónicos"
                />
              </div>

              <div>
                <Label htmlFor="image">URL de Imagen (opcional)</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="/ruta/a/imagen.jpg"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Añadiendo..." : "Añadir Producto"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
