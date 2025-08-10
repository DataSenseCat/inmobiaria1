'use client'

import { Card, CardContent } from '@/components/ui/card'

interface DevelopmentsListProps {
  userRole: 'admin' | 'agent'
  onEdit?: (development: any) => void
  onStatsChange?: () => void
}

export function DevelopmentsList({ userRole, onEdit, onStatsChange }: DevelopmentsListProps) {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <p className="text-gray-500 mb-4">Gestión de Emprendimientos</p>
        <p className="text-sm text-gray-400">
          Esta sección permite administrar proyectos inmobiliarios y desarrollos.
        </p>
      </CardContent>
    </Card>
  )
}
