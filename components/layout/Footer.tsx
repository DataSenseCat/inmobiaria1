import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="bg-white text-gray-900 px-4 py-2 rounded inline-block mb-4">
              <div className="text-lg font-bold">CATAMARCA</div>
              <div className="text-xs text-gray-600 uppercase tracking-wider">INMOBILIARIA</div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Más de 15 años conectando personas con sus hogares ideales en 
              el corazón de Argentina.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/propiedades" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Propiedades
                </Link>
              </li>
              <li>
                <Link href="/emprendimientos" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Emprendimientos
                </Link>
              </li>
              <li>
                <Link href="/tasaciones" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Tasaciones
                </Link>
              </li>
              <li>
                <Link href="/la-empresa" className="text-gray-300 hover:text-white transition-colors text-sm">
                  La Empresa
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/propiedades?operation=venta" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Venta de Propiedades
                </Link>
              </li>
              <li>
                <Link href="/propiedades?operation=alquiler" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Alquiler de Propiedades
                </Link>
              </li>
              <li>
                <Link href="/tasaciones" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Tasaciones Gratuitas
                </Link>
              </li>
              <li>
                <Link href="/emprendimientos" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Desarrollos Inmobiliarios
                </Link>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Asesoramiento Legal</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  {process.env.NEXT_PUBLIC_OFFICE_ADDRESS || 'Av. Belgrano 1250'}<br />
                  San Fernando del Valle de Catamarca<br />
                  Catamarca, Argentina
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a 
                  href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE || '+54 383 456-7890'}`}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+54 383 456-7890'}
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a 
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@inmobiliariacatamarca.com'}`}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@inmobiliariacatamarca.com'}
                </a>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="text-sm font-semibold text-gray-200 mb-2">Horarios</h4>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Lun - Vie: 9:00 - 18:00</div>
                <div>Sábados: 9:00 - 13:00</div>
                <div>Domingos: Cerrado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Inmobiliaria Catamarca. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6">
              <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors text-sm">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors text-sm">
                Términos de Uso
              </Link>
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors text-sm">
                Panel Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
