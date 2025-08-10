import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building, 
  Users, 
  Award, 
  Target, 
  Heart, 
  Shield,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle,
  Star,
  Quote
} from 'lucide-react'

export default function CompanyPage() {
  const stats = [
    {
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      value: '15+',
      label: 'Años de experiencia',
      description: 'En el mercado inmobiliario'
    },
    {
      icon: <Building className="w-8 h-8 text-green-600" />,
      value: '2,500+',
      label: 'Propiedades vendidas',
      description: 'Operaciones exitosas'
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      value: '5,000+',
      label: 'Clientes satisfechos',
      description: 'Confían en nosotros'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      value: '98%',
      label: 'Satisfacción',
      description: 'De nuestros clientes'
    }
  ]

  const services = [
    {
      icon: <Building className="w-6 h-6" />,
      title: 'Venta de Propiedades',
      description: 'Asesoramiento integral para vender tu propiedad al mejor precio y en el menor tiempo posible.',
      features: ['Tasación gratuita', 'Marketing digital', 'Visitas organizadas', 'Tramitación completa']
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Alquiler y Administración',
      description: 'Gestión completa de alquileres con garantía de cobro y mantenimiento de propiedades.',
      features: ['Búsqueda de inquilinos', 'Administración de contratos', 'Cobranzas', 'Mantenimiento']
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Asesoramiento de Inversión',
      description: 'Te ayudamos a encontrar las mejores oportunidades de inversión inmobiliaria.',
      features: ['Análisis de mercado', 'ROI proyectado', 'Zonas en crecimiento', 'Financiamiento']
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Servicios Legales',
      description: 'Asesoramiento jurídico especializado para todas tus operaciones inmobiliarias.',
      features: ['Revisión de contratos', 'Escrituración', 'Registro de propiedad', 'Asesoría legal']
    }
  ]

  const team = [
    {
      name: 'Roberto Fernández',
      position: 'Director General',
      description: 'Más de 20 años en el mercado inmobiliario. Especialista en inversiones y desarrollos.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      credentials: ['Martillero Público', 'MBA Inmobiliario']
    },
    {
      name: 'María Rodríguez',
      position: 'Gerente Comercial',
      description: 'Especialista en ventas residenciales y comerciales. Experta en el mercado catamarqueño.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b8fcb9a4?w=400&h=400&fit=crop&crop=face',
      credentials: ['Agente Inmobiliario', 'Especialista en Marketing']
    },
    {
      name: 'Carlos Gómez',
      position: 'Responsable de Tasaciones',
      description: 'Tasador certificado con amplia experiencia en valuaciones comerciales y residenciales.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      credentials: ['Tasador Certificado', 'Ingeniero Civil']
    },
    {
      name: 'Ana González',
      position: 'Administración de Alquileres',
      description: 'Especialista en gestión de alquileres y administración de propiedades.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      credentials: ['Contadora Pública', 'Administradora']
    }
  ]

  const testimonials = [
    {
      name: 'Juan Carlos Pérez',
      role: 'Propietario',
      comment: 'Vendieron mi casa en tiempo récord y al precio que esperaba. Muy profesionales en todo el proceso.',
      rating: 5,
      location: 'Barrio Norte'
    },
    {
      name: 'Laura Martínez',
      role: 'Inversora',
      comment: 'Me ayudaron a encontrar la inversión perfecta. El retorno superó mis expectativas.',
      rating: 5,
      location: 'Centro'
    },
    {
      name: 'Miguel Sánchez',
      role: 'Comprador',
      comment: 'Excelente atención desde el primer día. Me acompañaron en cada paso de la compra.',
      rating: 5,
      location: 'Villa Cubas'
    }
  ]

  const certifications = [
    'Colegio de Martilleros de Catamarca',
    'Cámara Inmobiliaria Argentina',
    'Registro Nacional de Administradores',
    'Certificación ISO 9001'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-4">
              Desde 2008
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Inmobiliaria Catamarca
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Líderes en el mercado inmobiliario catamarqueño con más de 15 años de experiencia, 
              conectando sueños con realidades a través del mejor servicio profesional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => window.location.href = '/contacto'}
              >
                Contactar Ahora
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.location.href = '/propiedades'}
              >
                Ver Propiedades
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Nuestra Misión</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Ser el puente que conecta a las personas con sus sueños inmobiliarios, 
                  brindando un servicio integral, profesional y transparente que supere 
                  las expectativas de nuestros clientes en cada operación.
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Servicio personalizado y profesional</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Transparencia en todas las operaciones</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Acompañamiento integral</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Heart className="w-8 h-8 text-red-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Nuestra Visión</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Ser reconocidos como la inmobiliaria líder en Catamarca, expandiendo 
                  nuestros servicios a nivel regional, siempre manteniendo nuestra esencia 
                  de cercanía, confianza y excelencia en el servicio.
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Liderazgo en el mercado regional</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Innovación tecnológica</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Expansión responsable</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una gama completa de servicios inmobiliarios para cubrir todas tus necesidades
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Profesionales capacitados y comprometidos con tu éxito inmobiliario
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 text-sm font-medium mb-3">
                    {member.position}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    {member.description}
                  </p>
                  <div className="space-y-1">
                    {member.credentials.map((credential, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {credential}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-gray-600">
              Testimonios reales de personas que confiaron en nosotros
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-blue-600 mb-4" />
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-4">
                    "{testimonial.comment}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-blue-600">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Certificaciones y Membresías
            </h2>
            <p className="text-gray-600">
              Avalados por las principales instituciones del sector inmobiliario
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900">
                    {cert}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">
                ¿Listo para tu próxima operación inmobiliaria?
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Nuestro equipo está preparado para ayudarte a alcanzar tus objetivos inmobiliarios. 
                Contactanos hoy mismo y descubrí la diferencia de trabajar con profesionales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => window.location.href = '/contacto'}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contactar Ahora
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => window.location.href = '/tasaciones'}
                >
                  Solicitar Tasación Gratuita
                </Button>
              </div>
              
              {/* Contact Info */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+54 383 456-7890</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">info@inmobiliariacatamarca.com</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Av. República 123, Catamarca</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
