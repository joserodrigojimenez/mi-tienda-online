"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Package, Truck, CheckCircle, X } from "lucide-react"
import type { Order } from "@/lib/types"

interface OrderStatusTrackerProps {
  status: Order["status"]
  createdAt: Date | any // Allow for Firestore Timestamp or string
  updatedAt: Date | any // Allow for Firestore Timestamp or string
}

const toDate = (dateValue: any): Date => {
  if (!dateValue) return new Date()

  // If it's already a Date object
  if (dateValue instanceof Date) return dateValue

  // If it's a Firestore Timestamp
  if (dateValue.toDate && typeof dateValue.toDate === "function") {
    return dateValue.toDate()
  }

  // If it's a string or number, try to parse it
  const parsed = new Date(dateValue)
  return isNaN(parsed.getTime()) ? new Date() : parsed
}

export function OrderStatusTracker({ status, createdAt, updatedAt }: OrderStatusTrackerProps) {
  const safeCreatedAt = toDate(createdAt)
  const safeUpdatedAt = toDate(updatedAt)

  const statusSteps = [
    { key: "pending", label: "Pedido Recibido", icon: Clock },
    { key: "processing", label: "Procesando", icon: Package },
    { key: "shipped", label: "Enviado", icon: Truck },
    { key: "delivered", label: "Entregado", icon: CheckCircle },
  ]

  const getStatusIndex = (currentStatus: Order["status"]) => {
    if (currentStatus === "cancelled") return -1
    return statusSteps.findIndex((step) => step.key === currentStatus)
  }

  const currentIndex = getStatusIndex(status)

  if (status === "cancelled") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 text-red-600">
            <X className="h-5 w-5" />
            <span className="font-medium">Pedido Cancelado</span>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Cancelado el {safeUpdatedAt.toLocaleDateString("es-ES")}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="font-serif font-semibold text-lg">Estado del Pedido</h3>

          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const StepIcon = step.icon
              const isCompleted = index <= currentIndex
              const isCurrent = index === currentIndex

              return (
                <div key={step.key} className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground text-muted-foreground"
                    }`}
                  >
                    <StepIcon className="h-4 w-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                      {isCurrent && (
                        <Badge variant="default" className="text-xs">
                          Actual
                        </Badge>
                      )}
                    </div>
                    {isCompleted && (
                      <p className="text-xs text-muted-foreground">
                        {index === 0
                          ? `Recibido el ${safeCreatedAt.toLocaleDateString("es-ES")}`
                          : `Actualizado el ${safeUpdatedAt.toLocaleDateString("es-ES")}`}
                      </p>
                    )}
                  </div>

                  {index < statusSteps.length - 1 && (
                    <div className={`w-px h-8 ml-5 ${isCompleted ? "bg-primary" : "bg-muted-foreground/30"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
