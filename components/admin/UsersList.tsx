'use client'

import { Card, CardContent } from '@/components/ui/card'

interface UsersListProps {
  onStatsChange?: () => void
}

export function UsersList({ onStatsChange }: UsersListProps) {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <p className="text-gray-500 mb-4">Gestión de Usuarios</p>
        <p className="text-sm text-gray-400">
          Esta sección permite administrar usuarios, roles y permisos del sistema.
        </p>
      </CardContent>
    </Card>
  )
}
