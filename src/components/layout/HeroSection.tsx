import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

export default function HeroSection() {
  return (
    <section className="relative h-[60vh] bg-cover bg-center bg-no-repeat" 
             style={{
               backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80')`
             }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative z-10 flex items-center justify-center h-full"
           style={{
             backgroundImage: 'url(https://cdn.builder.io/api/v1/image/assets%2Fa29a65487a2246d2b8205b8a9cb7b6f7%2Fe62524b860a146119d88717fab28ad54)',
             backgroundRepeat: 'no-repeat',
             backgroundPosition: 'center',
             backgroundSize: 'cover'
           }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
            Encuentre su propiedad
          </h1>
          
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tipo propiedad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="departamento">Departamento</SelectItem>
                  <SelectItem value="ph">PH</SelectItem>
                  <SelectItem value="lote">Lote</SelectItem>
                  <SelectItem value="local">Local Comercial</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Operación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="alquiler">Alquiler</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="capital">San Fernando del Valle de Catamarca</SelectItem>
                  <SelectItem value="andalgala">Andalgalá</SelectItem>
                  <SelectItem value="belen">Belén</SelectItem>
                  <SelectItem value="santa-maria">Santa María</SelectItem>
                  <SelectItem value="tinogasta">Tinogasta</SelectItem>
                </SelectContent>
              </Select>

              <Button className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold">
                Buscar
              </Button>
            </div>
            
            <div className="text-center">
              <button className="text-gray-600 hover:text-gray-800 text-sm font-medium underline">
                Búsqueda avanzada
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
