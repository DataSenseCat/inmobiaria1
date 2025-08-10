import { Metadata } from 'next'
import { ValuationForm } from '@/components/forms/ValuationForm'
import { Phone, Mail, Clock, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tasaciones Gratuitas - Inmobiliaria Catamarca',
  description: 'Obtén una tasación gratuita y profesional de tu propiedad en Catamarca. Servicio rápido y confiable.',
  openGraph: {
    title: 'Tasaciones Gratuitas - Inmobiliaria Catamarca',
    description: 'Solicita una tasación profesional y gratuita de tu propiedad',
    type: 'website'
  }
}

export default function TasacionesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tasaciones Profesionales
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              ¿Querés conocer el valor real de tu propiedad? Nuestro equipo de expertos 
              te brinda una tasación gratuita y profesional en Catamarca.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-blue-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">100% Gratuito</h3>
                <p className="text-blue-100">Sin costos ocultos ni compromisos</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Respuesta Rápida</h3>
                <p className="text-blue-100">Te contactamos en 24 horas</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Certificado</h3>
                <p className="text-blue-100">Realizada por profesionales matriculados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Solicitar Tasación Gratuita
            </h2>
            <ValuationForm />
          </div>

          {/* Information Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir nuestras tasaciones?
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Más de 15 años de experiencia en el mercado inmobiliario catamarqueño</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Base de datos actualizada con precios del mercado local</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Análisis comparativo con propiedades similares en la zona</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Informe detallado con recomendaciones personalizadas</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Asesoramiento sobre mejoras que pueden aumentar el valor</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900 text-white rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4">
                ¿Necesitás más información?
              </h3>
              <p className="text-gray-300 mb-6">
                Nuestro equipo está disponible para responder todas tus consultas sobre 
                tasaciones y el mercado inmobiliario en Catamarca.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span>{process.env.NEXT_PUBLIC_CONTACT_PHONE || '+54 383 456-7890'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span>{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'tasaciones@inmobiliariacatamarca.com'}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="font-semibold mb-2">Horarios de Atención</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Lunes a Viernes: 9:00 - 18:00</div>
                  <div>Sábados: 9:00 - 13:00</div>
                  <div>Domingos: Cerrado</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                💡 Tip Inmobiliario
              </h3>
              <p className="text-blue-800 text-sm">
                El valor de una propiedad puede variar significativamente según el estado 
                de conservación, las mejoras realizadas y las condiciones del mercado. 
                Una tasación profesional te ayuda a tomar decisiones informadas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Listo para vender o alquilar tu propiedad?
            </h2>
            <p className="text-gray-600 mb-8">
              Una vez que conozcas el valor de tu propiedad, podemos ayudarte a 
              promocionarla y encontrar los mejores compradores o inquilinos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contacto" 
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Hablar con un Asesor
              </a>
              <a 
                href="/propiedades" 
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ver Propiedades
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
