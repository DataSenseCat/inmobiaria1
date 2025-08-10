import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent } from '../ui/card'
import { cn } from '../../lib/utils'

interface FiltersBarProps {
  showOperation?: boolean
  showType?: boolean
  showCity?: boolean
  showPrice?: boolean
  showRooms?: boolean
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export default function FiltersBar({
  showOperation = true,
  showType = true,
  showCity = true,
  showPrice = true,
  showRooms = true,
  orientation = 'horizontal',
  className
}: FiltersBarProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [filters, setFilters] = useState({
    operation: searchParams.get('operation') || '',
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rooms: searchParams.get('rooms') || '',
    search: searchParams.get('search') || ''
  })

  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    const queryString = params.toString()
    const currentPath = window.location.pathname
    
    navigate(queryString ? `${currentPath}?${queryString}` : currentPath, { replace: true })
  }, [filters, router])

  const updateFilter = (key: string, value: string) => {
    // Convert placeholder values back to empty strings
    const placeholderValues = ['all-operations', 'all-types', 'all-cities', 'no-limit', 'any-amount']
    const actualValue = placeholderValues.includes(value) ? '' : value
    setFilters(prev => ({ ...prev, [key]: actualValue }))
  }

  const clearFilters = () => {
    setFilters({
      operation: '',
      type: '',
      city: '',
      maxPrice: '',
      rooms: '',
      search: ''
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  const operationOptions = [
    { value: 'venta', label: 'Venta' },
    { value: 'alquiler', label: 'Alquiler' }
  ]

  const typeOptions = [
    { value: 'casa', label: 'Casa' },
    { value: 'departamento', label: 'Departamento' },
    { value: 'ph', label: 'PH' },
    { value: 'lote', label: 'Lote' },
    { value: 'local', label: 'Local Comercial' }
  ]

  const priceOptions = [
    { value: '50000', label: 'Hasta USD 50,000' },
    { value: '100000', label: 'Hasta USD 100,000' },
    { value: '150000', label: 'Hasta USD 150,000' },
    { value: '200000', label: 'Hasta USD 200,000' },
    { value: '300000', label: 'Hasta USD 300,000' }
  ]

  const roomOptions = [
    { value: '1', label: '1 ambiente' },
    { value: '2', label: '2 ambientes' },
    { value: '3', label: '3 ambientes' },
    { value: '4', label: '4+ ambientes' }
  ]

  const cities = [
    'San Fernando del Valle de Catamarca',
    'Andalgalá',
    'Belén',
    'Santa María',
    'Tinogasta',
    'Fiambalá'
  ]

  const FilterSection = () => (
    <>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por título o ubicación..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Operation Filter */}
      {showOperation && (
        <Select value={filters.operation} onValueChange={(value) => updateFilter('operation', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Operación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-operations">Todas las operaciones</SelectItem>
            {operationOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Type Filter */}
      {showType && (
        <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">Todos los tipos</SelectItem>
            {typeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* City Filter */}
      {showCity && (
        <Select value={filters.city} onValueChange={(value) => updateFilter('city', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Ciudad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-cities">Todas las ciudades</SelectItem>
            {cities.map(city => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Price Filter */}
      {showPrice && (
        <Select value={filters.maxPrice} onValueChange={(value) => updateFilter('maxPrice', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Precio máximo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-limit">Sin límite</SelectItem>
            {priceOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Rooms Filter */}
      {showRooms && (
        <Select value={filters.rooms} onValueChange={(value) => updateFilter('rooms', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Ambientes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any-amount">Cualquier cantidad</SelectItem>
            {roomOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="whitespace-nowrap"
        >
          <X className="h-4 w-4 mr-2" />
          Limpiar Filtros
        </Button>
      )}
    </>
  )

  if (orientation === 'vertical') {
    return (
      <Card className={cn('', className)}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5" />
              <h3 className="font-semibold">Filtros de Búsqueda</h3>
            </div>
            <FilterSection />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </div>
          <span className={cn('transition-transform', isExpanded && 'rotate-180')}>
            ↓
          </span>
        </Button>
      </div>

      {/* Desktop Filters (always visible) */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <FilterSection />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filters (collapsible) */}
      {isExpanded && (
        <div className="md:hidden">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <FilterSection />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
