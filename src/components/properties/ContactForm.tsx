'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createLead } from '@/app/actions/leads'

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres')
}).refine(data => data.phone || data.email, {
  message: 'Debes proporcionar al menos un teléfono o email',
  path: ['phone']
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormProps {
  propertyId: string
  propertyTitle: string
}

export default function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      message: `Hola! Me interesa la propiedad "${propertyTitle}". ¿Podrían contactarme?`
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      const result = await createLead({
        property_id: propertyId,
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        message: data.message
      })

      if (result.success) {
        setSubmitted(true)
        reset()
      } else {
        alert('Error al enviar el mensaje. Por favor intenta nuevamente.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error al enviar el mensaje. Por favor intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">¡Mensaje Enviado!</h3>
              <p className="text-sm text-muted-foreground">
                Nos pondremos en contacto contigo pronto.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setSubmitted(false)}
              className="w-full"
            >
              Enviar Otro Mensaje
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitar Información</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Nombre completo *"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              placeholder="Teléfono"
              type="tel"
              {...register('phone')}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Input
              placeholder="Email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <textarea
              placeholder="Mensaje *"
              rows={4}
              {...register('message')}
              className={`w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.message ? 'border-red-500' : 'border-input'
              }`}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Mensaje
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            * Campos requeridos. Debes proporcionar al menos teléfono o email.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
