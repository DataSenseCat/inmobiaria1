import { Metadata } from 'next'
import { ContactForm } from '@/components/forms/ContactForm'
import { ContactMap } from '@/components/contact/ContactMap'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto - Inmobiliaria Catamarca',
  description: 'Ponte en contacto con nosotros. Oficina en el centro de Catamarca. Atención personalizada para todas tus consultas inmobiliarias.',
  openGraph: {
    title: 'Contacto - Inmobiliaria Catamarca',
    description: 'Estamos aquí para ayudarte con todas tus necesidades inmobiliarias',
    type: 'website'
  }
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Estamos Aquí Para Ayudarte
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              ¿Tenés alguna consulta sobre propiedades, tasaciones o querés más información? 
              Nuestro equipo está listo para asistirte.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Envianos tu Consulta
              </h2>
              <ContactForm />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información de Contacto
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Dirección</div>
                    <div className="text-gray-600 text-sm">
                      {process.env.NEXT_PUBLIC_OFFICE_ADDRESS || 'Av. Belgrano 1250, San Fernando del Valle de Catamarca'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Teléfono</div>
                    <div className="text-gray-600 text-sm">
                      {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+54 383 456-7890'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MessageCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">WhatsApp</div>
                    <div className="text-gray-600 text-sm">
                      <a 
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace('+', '') || '543834567890'}`}
                        className="text-blue-600 hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+54 383 456-7890'}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-gray-600 text-sm">
                      <a 
                        href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@inmobiliariacatamarca.com'}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@inmobiliariacatamarca.com'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                Horarios de Atención
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lunes a Viernes</span>
                  <span className="font-medium">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábados</span>
                  <span className="font-medium">9:00 - 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domingos</span>
                  <span className="font-medium text-red-600">Cerrado</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  * Para visitas a propiedades, también atendemos fines de semana 
                  con cita previa.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <a 
                  href="/tasaciones" 
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded transition-colors"
                >
                  Solicitar Tasación
                </a>
                <a 
                  href="/propiedades" 
                  className="block w-full text-center border border-gray-600 hover:bg-gray-800 py-2 px-4 rounded transition-colors"
                >
                  Ver Propiedades
                </a>
                <a 
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace('+', '') || '543834567890'}?text=Hola,%20me%20interesa%20obtener%20m%C3%A1s%20informaci%C3%B3n`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-green-600 hover:bg-green-700 py-2 px-4 rounded transition-colors"
                >
                  Escribir por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Nuestra Ubicación
              </h3>
              <p className="text-gray-600 mt-2">
                Visitanos en nuestras oficinas en el centro de San Fernando del Valle de Catamarca
              </p>
            </div>
            <div className="h-96">
              <ContactMap />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Resolvé las dudas más comunes sobre nuestros servicios
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Cuánto cuesta una tasación?
              </h3>
              <p className="text-gray-600 text-sm">
                Las tasaciones para clientes que deseen vender o alquilar con nosotros 
                son completamente gratuitas. Para otros casos, consultá nuestras tarifas.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Manejan propiedades en toda la provincia?
              </h3>
              <p className="text-gray-600 text-sm">
                Nos especializamos en el Gran Catamarca, pero también manejamos propiedades 
                en localidades cercanas. Consultanos por tu zona específica.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Cuánto demora vender una propiedad?
              </h3>
              <p className="text-gray-600 text-sm">
                El tiempo depende de varios factores como ubicación, precio y condiciones 
                del mercado. En promedio, nuestras propiedades se venden en 3-6 meses.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Qué documentación necesito para vender?
              </h3>
              <p className="text-gray-600 text-sm">
                Título de propiedad, certificado de dominio actualizado, planos municipales 
                y documentos de identidad. Te asesoramos con toda la documentación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
