import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from './button'
import { Input } from './input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { cn } from '../../lib/utils'

interface HeroProps {
  title?: string
  subtitle?: string
  backgroundImage?: string
  showSearchBar?: boolean
  ctaText?: string
  ctaLink?: string
  height?: 'h-96' | 'h-screen' | 'h-[60vh]' | 'h-[80vh]'
  textAlign?: 'left' | 'center' | 'right'
  className?: string
}

export default function Hero({
  title = 'Encuentra tu Hogar Ideal',
  subtitle = 'Las mejores propiedades en Catamarca',
  backgroundImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80',
  showSearchBar = true,
  ctaText = 'Ver Propiedades',
  ctaLink = '/propiedades',
  height = 'h-[60vh]',
  textAlign = 'center',
  className
}: HeroProps) {
  const navigate = useNavigate()
  const [searchFilters, setSearchFilters] = useState({
    operation: '',
    type: '',
    location: ''
  })

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    const queryString = params.toString()
    const searchUrl = queryString ? `/propiedades?${queryString}` : '/propiedades'
    
    navigate(searchUrl)
  }

  const textAlignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[textAlign]

  const flexAlignClass = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end'
  }[textAlign]

  return (
    <section className={cn('relative overflow-hidden', height, className)}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className={cn('relative h-full flex flex-col justify-center', flexAlignClass)}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={cn('max-w-4xl mx-auto', textAlignClass)}
          >
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
              {subtitle}
            </p>

            {/* Search Bar */}
            {showSearchBar && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white rounded-2xl p-4 shadow-2xl mb-8 max-w-4xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Operation Select */}
                  <Select
                    value={searchFilters.operation}
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, operation: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Comprar / Alquilar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venta">Comprar</SelectItem>
                      <SelectItem value="alquiler">Alquilar</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Type Select */}
                  <Select
                    value={searchFilters.type}
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de propiedad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="departamento">Departamento</SelectItem>
                      <SelectItem value="ph">PH</SelectItem>
                      <SelectItem value="lote">Lote</SelectItem>
                      <SelectItem value="local">Local Comercial</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Location Input */}
                  <div className="relative">
                    <Input
                      placeholder="Ubicación"
                      value={searchFilters.location}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>

                  {/* Search Button */}
                  <Button
                    onClick={handleSearch}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </motion.div>
            )}

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={textAlign === 'center' ? 'text-center' : ''}
            >
              <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full">
                <Link to={ctaLink}>
                  {ctaText}
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center text-white/70">
          <span className="text-sm mb-2">Descubre más</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
