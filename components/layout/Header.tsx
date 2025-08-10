'use client'

import Link from 'next/link'
import { Search, Phone, Mail, MapPin, ChevronDown, Menu, X, User, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useSupabase } from '@/lib/hooks/useSupabase'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false)
  const { user, signOut } = useSupabase()

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-100 border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">{process.env.NEXT_PUBLIC_CONTACT_PHONE || '+54 383 456-7890'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@inmobiliariacatamarca.com'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Catamarca, Argentina</span>
              </div>
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link href="/favoritos" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                    <Heart className="h-4 w-4" />
                    <span>Favoritos</span>
                  </Link>
                  <button onClick={signOut} className="text-gray-700 hover:text-gray-900">
                    Salir
                  </button>
                </div>
              ) : (
                <Link href="/auth/sign-in" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                  <User className="h-4 w-4" />
                  <span>Ingresar</span>
                </Link>
              )}
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
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Inicio
              </Link>

              {/* Properties Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  onMouseEnter={() => setPropertiesDropdownOpen(true)}
                  onMouseLeave={() => setPropertiesDropdownOpen(false)}
                >
                  <span>Propiedades</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {propertiesDropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg border rounded-md py-2 z-50"
                    onMouseEnter={() => setPropertiesDropdownOpen(true)}
                    onMouseLeave={() => setPropertiesDropdownOpen(false)}
                  >
                    <Link href="/propiedades" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Todas las Propiedades
                    </Link>
                    <Link href="/propiedades?operation=venta" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      En Venta
                    </Link>
                    <Link href="/propiedades?operation=alquiler" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      En Alquiler
                    </Link>
                    <Link href="/propiedades?operation=temporal" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Alquiler Temporario
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/emprendimientos" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Emprendimientos
              </Link>

              <Link href="/tasaciones" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Tasaciones
              </Link>

              <Link href="/la-empresa" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                La Empresa
              </Link>

              <Link href="/contacto" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Contacto
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Search */}
            <div className="hidden xl:flex items-center space-x-4">
              <div className="relative">
                <Input
                  placeholder="Buscar por código..."
                  className="w-48 pr-10 bg-gray-50 border-gray-300 focus:border-gray-500"
                />
                <Button size="sm" className="absolute right-1 top-1 h-8 w-8 p-0 bg-gray-600 hover:bg-gray-700">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-4">
                <Link
                  href="/"
                  className="block text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  href="/propiedades"
                  className="block text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Propiedades
                </Link>
                <Link
                  href="/propiedades?operation=venta"
                  className="block text-gray-600 hover:text-gray-800 ml-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  En Venta
                </Link>
                <Link
                  href="/propiedades?operation=alquiler"
                  className="block text-gray-600 hover:text-gray-800 ml-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  En Alquiler
                </Link>
                <Link
                  href="/propiedades?operation=temporal"
                  className="block text-gray-600 hover:text-gray-800 ml-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Alquiler Temporario
                </Link>
                <Link
                  href="/emprendimientos"
                  className="block text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Emprendimientos
                </Link>
                <Link
                  href="/tasaciones"
                  className="block text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tasaciones
                </Link>
                <Link
                  href="/la-empresa"
                  className="block text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  La Empresa
                </Link>
                <Link
                  href="/contacto"
                  className="block text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contacto
                </Link>

                {/* Mobile Search */}
                <div className="pt-4 border-t">
                  <div className="relative">
                    <Input
                      placeholder="Buscar por código..."
                      className="w-full pr-10 bg-gray-50 border-gray-300"
                    />
                    <Button size="sm" className="absolute right-1 top-1 h-8 w-8 p-0 bg-gray-600 hover:bg-gray-700">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
