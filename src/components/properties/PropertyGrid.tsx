interface PropertyGridProps {
  showFeatured?: boolean
  pageSize?: number
  filters?: any
}

export default function PropertyGrid({ showFeatured, pageSize, filters }: PropertyGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-2">Propiedad de Ejemplo</h3>
        <p className="text-gray-600">Componente PropertyGrid en desarrollo...</p>
      </div>
    </div>
  )
}
