'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, Loader2 } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono inválido'),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres')
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormProps {
  propertyId?: string
  propertyTitle?: string
  developmentId?: string
  developmentTitle?: string
}

export function ContactForm({ 
  propertyId, 
  propertyTitle, 
  developmentId, 
  developmentTitle 
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: propertyTitle 
        ? `Consulta sobre: ${propertyTitle}` 
        : developmentTitle 
        ? `Consulta sobre emprendimiento: ${developmentTitle}`
        : ''
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kind: 'contacto',
          property_id: propertyId || null,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: `${data.subject}\n\n${data.message}${
            developmentId ? `\n\nEmprendimiento ID: ${developmentId}` : ''
          }`
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        reset()
        setTimeout(() => setIsSuccess(false), 5000)
      } else {
        throw new Error('Error al enviar el mensaje')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error al enviar tu mensaje. Por favor, inténtalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ¡Mensaje Enviado!
        </h3>
        <p className="text-gray-600">
          Gracias por contactarnos. Te responderemos a la brevedad.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo *
          </label>
          <Input
            {...register('name')}
            placeholder="Tu nombre"
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
          Teléfono *
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Asunto *
        </label>
        <Input
          {...register('subject')}
          placeholder="¿En qué te podemos ayudar?"
          className={errors.subject ? 'border-red-500' : ''}
        />
        {errors.subject && (
          <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mensaje *
        </label>
        <textarea
          {...register('message')}
          rows={5}
          placeholder={propertyTitle 
            ? `Me interesa esta propiedad. Me gustaría obtener más información...`
            : developmentTitle
            ? `Me interesa este emprendimiento. Me gustaría obtener más información...`
            : `Escribe tu consulta aquí...`}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            errors.message ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          'Enviar Mensaje'
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Nos comprometemos a responder tu consulta en menos de 24 horas.
      </p>
    </form>
  )
}
