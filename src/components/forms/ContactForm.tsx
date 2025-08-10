'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { logError } from '@/lib/utils/errorUtils'
import { CheckCircle, Loader2, Send } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono inválido').optional(),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  contactPreference: z.enum(['email', 'phone', 'whatsapp'], {
    required_error: 'Selecciona tu preferencia de contacto'
  })
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      contactPreference: 'email'
    }
  })

  const contactPreference = watch('contactPreference')

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      // Here we would normally send to an API endpoint
      // For now, we'll simulate the API call
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'contact-form'
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        reset()
        setTimeout(() => setIsSuccess(false), 10000)
      } else {
        throw new Error('Error al enviar el mensaje')
      }
    } catch (error) {
      const errorLog = logError(error, 'ContactForm.onSubmit')
      
      // Fallback: Open email client
      const emailBody = `
Nombre: ${data.name}
Email: ${data.email}
Teléfono: ${data.phone || 'No proporcionado'}
Asunto: ${data.subject}
Preferencia de contacto: ${data.contactPreference}

Mensaje:
${data.message}
      `.trim()

      const emailUrl = `mailto:info@inmobiliariacatamarca.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(emailBody)}`
      window.location.href = emailUrl
      
      alert('Se abrirá tu cliente de email predeterminado para enviar el mensaje.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Mensaje Enviado!
        </h3>
        <p className="text-gray-600 mb-4">
          Gracias por contactarnos. Te responderemos dentro de las próximas 24 horas.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>También podés contactarnos directamente:</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/5493834567890"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              WhatsApp: +54 383 456-7890
            </a>
            <a 
              href="mailto:info@inmobiliariacatamarca.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Email: info@inmobiliariacatamarca.com
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo *
          </label>
          <Input
            {...register('name')}
            placeholder="Tu nombre completo"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <Input
            {...register('email')}
            type="email"
            placeholder="tu@email.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono {contactPreference === 'phone' || contactPreference === 'whatsapp' ? '*' : '(opcional)'}
        </label>
        <Input
          {...register('phone')}
          type="tel"
          placeholder="+54 383 456-7890"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Contact Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          ¿Cómo preferís que te contactemos? *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              {...register('contactPreference')}
              value="email"
              className="mr-3"
            />
            <div>
              <div className="font-medium text-sm">Email</div>
              <div className="text-xs text-gray-500">Respuesta por email</div>
            </div>
          </label>
          
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              {...register('contactPreference')}
              value="phone"
              className="mr-3"
            />
            <div>
              <div className="font-medium text-sm">Teléfono</div>
              <div className="text-xs text-gray-500">Llamada telefónica</div>
            </div>
          </label>
          
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              {...register('contactPreference')}
              value="whatsapp"
              className="mr-3"
            />
            <div>
              <div className="font-medium text-sm">WhatsApp</div>
              <div className="text-xs text-gray-500">Mensaje de WhatsApp</div>
            </div>
          </label>
        </div>
        {errors.contactPreference && (
          <p className="text-red-500 text-xs mt-1">{errors.contactPreference.message}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Asunto *
        </label>
        <select
          {...register('subject')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.subject ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Seleccionar asunto</option>
          <option value="Consulta sobre propiedad">Consulta sobre propiedad</option>
          <option value="Solicitar tasación">Solicitar tasación</option>
          <option value="Quiero vender mi propiedad">Quiero vender mi propiedad</option>
          <option value="Busco propiedad para comprar">Busco propiedad para comprar</option>
          <option value="Consulta sobre alquiler">Consulta sobre alquiler</option>
          <option value="Consulta sobre emprendimientos">Consulta sobre emprendimientos</option>
          <option value="Servicios de administración">Servicios de administración</option>
          <option value="Otro">Otro</option>
        </select>
        {errors.subject && (
          <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mensaje *
        </label>
        <textarea
          {...register('message')}
          rows={5}
          placeholder="Contanos en qué podemos ayudarte..."
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            errors.message ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando mensaje...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Enviar Mensaje
          </>
        )}
      </Button>

      {/* Contact alternatives */}
      <div className="border-t pt-6">
        <p className="text-sm text-gray-600 text-center mb-4">
          ¿Preferís contactarnos directamente?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://wa.me/5493834567890?text=Hola,%20me%20gustaría%20obtener%20más%20información"
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            WhatsApp
          </a>
          <a
            href="mailto:info@inmobiliariacatamarca.com"
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Email
          </a>
          <a
            href="tel:+5493834567890"
            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Llamar
          </a>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Al enviar este formulario, aceptás que nos contactemos contigo según tu preferencia seleccionada. 
        Tus datos se mantendrán confidenciales y no serán compartidos con terceros.
      </p>
    </form>
  )
}
