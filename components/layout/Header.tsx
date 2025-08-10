'use client'

import Link from 'next/link'
import { Search, Phone, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Header() {
  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-100 border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">+54 383 4567890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">contacto@inmobiliariacatamarca.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Catamarca, Argentina</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="bg-gray-800 text-white px-6 py-3 rounded border-2 border-gray-800">
                <div className="text-lg font-bold">CATAMARCA</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider">INMOBILIARIA</div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
                Inicio
              </Link>
              <Link href="/propiedades" className="text-gray-700 hover:text-gray-900 font-medium">
                Propiedades
              </Link>
              <Link href="/emprendimientos" className="text-gray-700 hover:text-gray-900 font-medium">
                Emprendimientos
              </Link>
              <Link href="/tasaciones" className="text-gray-700 hover:text-gray-900 font-medium">
                Tasaciones
              </Link>
              <Link href="/empresa" className="text-gray-700 hover:text-gray-900 font-medium">
                La Empresa
              </Link>
              <Link href="/venta" className="text-gray-700 hover:text-gray-900 font-medium">
                En Venta
              </Link>
              <Link href="/alquiler" className="text-gray-700 hover:text-gray-900 font-medium">
                En Alquiler
              </Link>
              <Link href="/contacto" className="text-gray-700 hover:text-gray-900 font-medium">
                Contacto
              </Link>
            </nav>

            {/* Search */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="relative">
                <Input
                  placeholder="Código aviso"
                  className="w-40 pr-10 bg-gray-50 border-gray-300"
                />
                <Button size="sm" className="absolute right-1 top-1 h-8 w-8 p-0 bg-gray-600 hover:bg-gray-700">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
