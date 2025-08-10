'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { logError } from '@/lib/utils/errorUtils'
import { CheckCircle, Loader2 } from 'lucide-react'

const valuationSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono inválido'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  propertyType: z.enum(['casa', 'departamento', 'ph', 'lote', 'local'], {
    required_error: 'Selecciona el tipo de propiedad'
  }),
  area: z.number().min(1, 'El área debe ser mayor a 0').optional(),
  message: z.string().optional()
})

type ValuationFormData = z.infer<typeof valuationSchema>

export default function ValuationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ValuationFormData>({
    resolver: zodResolver(valuationSchema)
  })

  const onSubmit = async (data: ValuationFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kind: 'tasacion',
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: `Solicitud de tasación:
Dirección: ${data.address}
Tipo: ${data.propertyType}
${data.area ? `Área: ${data.area}m²` : ''}
${data.message ? `Mensaje: ${data.message}` : ''}`
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        reset()
        setTimeout(() => setIsSuccess(false), 5000)
      } else {
        throw new Error('Error al enviar la solicitud')
      }
    } catch (error) {
      const errorLog = logError(error, 'ValuationForm.onSubmit')
      alert(`Hubo un error al enviar tu solicitud: ${errorLog.message}. Por favor, inténtalo nuevamente.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ¡Solicitud Enviada!
        </h3>
        <p className="text-gray-600">
          Nos contactaremos contigo en las próximas 24 horas para coordinar la tasación gratuita.
        </p>
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
            placeholder="Juan Pérez"
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
            placeholder="juan@email.com"
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

      {/* Property Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección de la propiedad *
        </label>
        <Input
          {...register('address')}
          placeholder="Av. Belgrano 1250, Catamarca"
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de propiedad *
          </label>
          <select
            {...register('propertyType')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.propertyType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar tipo</option>
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            <option value="ph">PH</option>
            <option value="lote">Lote</option>
            <option value="local">Local Comercial</option>
          </select>
          {errors.propertyType && (
            <p className="text-red-500 text-xs mt-1">{errors.propertyType.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Área aproximada (m²)
          </label>
          <Input
            {...register('area', { valueAsNumber: true })}
            type="number"
            placeholder="120"
            min="1"
            className={errors.area ? 'border-red-500' : ''}
          />
          {errors.area && (
            <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comentarios adicionales
        </label>
        <textarea
          {...register('message')}
          rows={4}
          placeholder="Detalles adicionales sobre la propiedad..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">¿Qué incluye la tasación?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Evaluación presencial de la propiedad</li>
          <li>• Análisis comparativo del mercado</li>
          <li>• Informe detallado con valor estimado</li>
          <li>• Recomendaciones para maximizar el valor</li>
        </ul>
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
          'Solicitar Tasación Gratuita'
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Al enviar este formulario, aceptás que nos contactemos para coordinar la tasación. 
        Tus datos se mantendrán confidenciales.
      </p>
    </form>
  )
}
