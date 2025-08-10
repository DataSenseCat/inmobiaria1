'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface DevelopmentFormProps {
  development?: any
  onClose: () => void
  userRole: 'admin' | 'agent'
}

export function DevelopmentForm({ development, onClose, userRole }: DevelopmentFormProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {development ? 'Editar Emprendimiento' : 'Nuevo Emprendimiento'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Formulario de emprendimientos en desarrollo
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onClose}>
              Guardar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
