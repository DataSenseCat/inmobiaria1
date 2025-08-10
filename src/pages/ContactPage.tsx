import ContactForm from '../components/forms/ContactForm'
import ContactMap from '../components/contact/ContactMap'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  Navigation,
  Building,
  Users,
  Calendar,
  CheckCircle
} from 'lucide-react'

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6 text-green-600" />,
      title: 'Teléfono',
      primary: '+54 383 456-7890',
      secondary: 'Lunes a Viernes de 9 a 18hs',
      action: 'tel:+5493834567890',
      actionLabel: 'Llamar'
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-green-600" />,
      title: 'WhatsApp',
      primary: '+54 383 456-7890',
      secondary: 'Respuesta inmediata',
      action: 'https://wa.me/5493834567890?text=Hola,%20me%20gustaría%20obtener%20más%20información',
      actionLabel: 'Chatear'
    },
    {
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      title: 'Email',
      primary: 'info@inmobiliariacatamarca.com',
      secondary: 'Respuesta en 24hs',
      action: 'mailto:info@inmobiliariacatamarca.com',
      actionLabel: 'Escribir'
    },
    {
      icon: <MapPin className="h-6 w-6 text-purple-600" />,
      title: 'Oficina',
      primary: 'Av. República 123',
      secondary: 'San Fernando del Valle de Catamarca',
      action: 'https://www.google.com/maps/search/?api=1&query=-28.4696,-65.7795',
      actionLabel: 'Ver Mapa'
    }
  ]

  const officeHours = [
    { day: 'Lunes a Viernes', hours: '9:00 - 18:00' },
    { day: 'Sábados', hours: '9:00 - 13:00' },
    { day: 'Domingos', hours: 'Cerrado' }
  ]

  const departments = [
    {
      name: 'Ventas',
      description: 'Consultas sobre compra y venta de propiedades',
      email: 'ventas@inmobiliariacatamarca.com',
      phone: '+54 383 456-7890'
    },
    {
      name: 'Alquileres',
      description: 'Gestión de alquileres y administración',
      email: 'alquileres@inmobiliariacatamarca.com',
      phone: '+54 383 456-7891'
    },
    {
      name: 'Tasaciones',
      description: 'Solicitudes de tasación y valuación',
      email: 'tasaciones@inmobiliariacatamarca.com',
      phone: '+54 383 456-7892'
    },
    {
      name: 'Administración',
      description: 'Consultas administrativas y facturación',
      email: 'admin@inmobiliariacatamarca.com',
      phone: '+54 383 456-7893'
    }
  ]

  const faqs = [
    {
      question: '¿Cuál es el horario de atención?',
      answer: 'Atendemos de lunes a viernes de 9:00 a 18:00 y sábados de 9:00 a 13:00. Por WhatsApp respondemos las 24 horas.'
    },
    {
      question: '¿Hacen tasaciones gratuitas?',
      answer: 'Sí, todas nuestras tasaciones son completamente gratuitas y sin compromiso.'
    },
    {
      question: '¿En qué zonas operan?',
      answer: 'Operamos en toda la provincia de Catamarca, con foco principal en San Fernando del Valle de Catamarca y alrededores.'
    },
    {
      question: '¿Cómo puedo publicar mi propiedad?',
      answer: 'Podés contactarnos por cualquier medio y programaremos una visita gratuita para evaluar tu propiedad.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contactános
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              ¿Tenés alguna consulta? Nos encantaría ayudarte. Contáctanos a través de cualquiera de nuestros canales de comunicación y te responderemos a la brevedad.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Respuesta rápida
              </div>
              <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Atención personalizada
              </div>
              <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Asesoramiento gratuito
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Methods */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Formas de Contacto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {method.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {method.primary}
                  </p>
                  <p className="text-xs text-gray-600 mb-4">
                    {method.secondary}
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(method.action, '_blank')}
                  >
                    {method.actionLabel}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Envíanos un Mensaje</CardTitle>
                <p className="text-gray-600">
                  Completá el formulario y nos contactaremos contigo en las próximas 24 horas
                </p>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Office Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-6 h-6 mr-2 text-blue-600" />
                  Información de la Oficina
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Dirección</h3>
                    <p className="text-gray-600">
                      Av. República 123<br />
                      San Fernando del Valle de Catamarca<br />
                      Catamarca, Argentina (CP 4700)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Horarios de Atención</h3>
                    <div className="space-y-1">
                      {officeHours.map((schedule, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{schedule.day}:</span>
                          <span className="text-gray-900 font-medium">{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Navigation className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Cómo llegar</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Estamos ubicados en pleno centro de la ciudad, cerca de bancos y comercios principales.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=-28.4696,-65.7795', '_blank')}
                    >
                      Ver en Google Maps
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Departments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-600" />
                  Departamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{dept.description}</p>
                      <div className="flex flex-col sm:flex-row gap-2 text-xs">
                        <a 
                          href={`mailto:${dept.email}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {dept.email}
                        </a>
                        <a 
                          href={`tel:${dept.phone.replace(/\s/g, '')}`}
                          className="text-green-600 hover:text-green-700"
                        >
                          {dept.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Nuestra Ubicación</CardTitle>
              <p className="text-gray-600">
                Visitanos en nuestra oficina en el centro de San Fernando del Valle de Catamarca
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80 rounded-lg overflow-hidden">
                <ContactMap />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Resolvemos las dudas más comunes. Si no encontrás la respuesta que buscás, no dudes en contactarnos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
            <CardContent className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                ¿Necesitás atención fuera del horario comercial?
              </h2>
              <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                Para emergencias relacionadas con propiedades en administración o situaciones urgentes, 
                contáctanos por WhatsApp. Respondemos las 24 horas.
              </p>
              <Button 
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100"
                onClick={() => window.open('https://wa.me/5493834567890?text=Hola,%20tengo%20una%20consulta%20urgente', '_blank')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp 24hs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
