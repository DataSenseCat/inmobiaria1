import ValuationForm from '@/components/forms/ValuationForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calculator, 
  FileText, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Star,
  Clock,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'

export default function ValuationPage() {
  const valuationSteps = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Contacto Inicial',
      description: 'Nos ponemos en contacto contigo para coordinar la visita y conocer más detalles de tu propiedad.'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Visita Técnica',
      description: 'Nuestro tasador profesional realiza una inspección detallada de la propiedad y el entorno.'
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: 'Análisis de Mercado',
      description: 'Analizamos propiedades comparables en la zona y las tendencias actuales del mercado.'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Informe Detallado',
      description: 'Recibís un informe completo con el valor estimado y recomendaciones para maximizar el precio.'
    }
  ]

  const whyChooseUs = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: 'Más de 15 años de experiencia',
      description: 'Nuestro equipo cuenta con amplia trayectoria en el mercado inmobiliario catamarqueño.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: 'Análisis de mercado actualizado',
      description: 'Utilizamos datos actuales y tendencias del mercado para brindarte la tasación más precisa.'
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      title: 'Servicio completamente gratuito',
      description: 'La tasación no tiene costo alguno. Es nuestro compromiso con propietarios de Catamarca.'
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      title: 'Respuesta en 24 horas',
      description: 'Nos contactamos contigo dentro de las 24 horas para coordinar la tasación.'
    }
  ]

  const testimonials = [
    {
      name: 'María González',
      location: 'Barrio Norte',
      rating: 5,
      comment: 'Excelente servicio. La tasación fue muy profesional y me ayudó a establecer un precio justo para mi casa.'
    },
    {
      name: 'Carlos Rodríguez', 
      location: 'Centro',
      rating: 5,
      comment: 'Muy conforme con el servicio. El informe fue detallado y las recomendaciones me ayudaron mucho en la venta.'
    },
    {
      name: 'Ana Pérez',
      location: 'Villa Cubas',
      rating: 5,
      comment: 'Profesionales serios y confiables. La tasación fue gratuita como prometieron y muy completa.'
    }
  ]

  const faqItems = [
    {
      question: '¿Realmente es gratuita la tasación?',
      answer: 'Sí, completamente gratuita. No cobramos nada por la visita, evaluación e informe de tasación.'
    },
    {
      question: '¿Cuánto tiempo demora el proceso?',
      answer: 'El proceso completo demora entre 3 a 5 días hábiles desde la solicitud hasta la entrega del informe.'
    },
    {
      question: '¿Qué incluye el informe de tasación?',
      answer: 'El informe incluye valor estimado, análisis comparativo de mercado, fotos de la propiedad, y recomendaciones para mejorar el valor.'
    },
    {
      question: '¿Debo estar presente durante la tasación?',
      answer: 'Preferentemente sí, para que puedas mostrar las características especiales de tu propiedad y resolver dudas.'
    },
    {
      question: '¿En qué zonas hacen tasaciones?',
      answer: 'Realizamos tasaciones en toda la provincia de Catamarca, priorizando San Fernando del Valle de Catamarca y alrededores.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-4">
              Servicio Gratuito
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tasación Gratuita de tu Propiedad
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Conocé el valor real de tu propiedad con nuestra tasación profesional y gratuita. 
              Más de 15 años de experiencia en el mercado inmobiliario catamarqueño.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="font-semibold">100% Gratuito</span>
                </div>
                <p className="text-sm text-blue-100">Sin costos ocultos</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 mr-2" />
                  <span className="font-semibold">Respuesta en 24hs</span>
                </div>
                <p className="text-sm text-blue-100">Contacto inmediato</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="w-6 h-6 mr-2" />
                  <span className="font-semibold">Informe Completo</span>
                </div>
                <p className="text-sm text-blue-100">Análisis detallado</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Solicitar Tasación Gratuita
                </CardTitle>
                <p className="text-gray-600 text-center">
                  Completá el formulario y nos contactaremos contigo en las próximas 24 horas
                </p>
              </CardHeader>
              <CardContent>
                <ValuationForm />
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <div className="space-y-6">
            {/* Process Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-6 h-6 mr-2 text-blue-600" />
                  ¿Cómo funciona?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {valuationSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {index + 1}. {step.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>¿Preferís contactarnos directamente?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <a 
                        href="https://wa.me/5493834567890?text=Hola,%20me%20interesa%20solicitar%20una%20tasación%20gratuita"
                        className="text-green-600 hover:text-green-700"
                      >
                        +54 383 456-7890
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a 
                        href="mailto:tasaciones@inmobiliariacatamarca.com?subject=Solicitud de Tasación"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        tasaciones@inmobiliariacatamarca.com
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir nuestra tasación?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Somos líderes en tasaciones inmobiliarias en Catamarca con un equipo de profesionales certificados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-gray-600">
              Testimonios reales de propietarios que confiaron en nosotros
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-4">
                    "{testimonial.comment}"
                  </p>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-500">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-600">
              Resolvemos las dudas más comunes sobre nuestro servicio de tasación
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-gray-600">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">
                ¿Estás pensando en vender tu propiedad?
              </h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Una tasación profesional es el primer paso para una venta exitosa. 
                Conocé el valor real de tu propiedad y vendé al mejor precio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#formulario"
                  className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector('.container')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Solicitar Tasación Gratuita
                </a>
                <a
                  href="/contacto"
                  className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Contactar Asesor
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
