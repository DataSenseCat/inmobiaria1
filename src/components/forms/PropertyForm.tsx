import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { Property } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Save, ArrowLeft, Upload, X, Plus } from 'lucide-react'

const propertySchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1, 'La ciudad es requerida'),
  type: z.enum(['casa', 'departamento', 'ph', 'lote', 'local']),
  operation: z.enum(['venta', 'alquiler', 'temporal']),
  price_usd: z.number().positive().optional(),
  price_ars: z.number().positive().optional(),
  rooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  area_covered: z.number().positive().optional(),
  area_total: z.number().positive().optional(),
  featured: z.boolean(),
  active: z.boolean(),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface PropertyFormProps {
  property?: Property
  onSubmit: (data: PropertyFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function PropertyForm({ property, onSubmit, onCancel, loading }: PropertyFormProps) {
  const [images, setImages] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(
    property?.coordinates || null
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title || '',
      description: property?.description || '',
      address: property?.address || '',
      city: property?.city || 'San Fernando del Valle de Catamarca',
      type: property?.type || 'casa',
      operation: property?.operation || 'venta',
      price_usd: property?.price_usd || undefined,
      price_ars: property?.price_ars || undefined,
      rooms: property?.rooms || undefined,
      bathrooms: property?.bathrooms || undefined,
      area_covered: property?.area_covered || undefined,
      area_total: property?.area_total || undefined,
      featured: property?.featured || false,
      active: property?.active || true,
    }
  })

  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        description: property.description || '',
        address: property.address || '',
        city: property.city,
        type: property.type,
        operation: property.operation,
        price_usd: property.price_usd || undefined,
        price_ars: property.price_ars || undefined,
        rooms: property.rooms || undefined,
        bathrooms: property.bathrooms || undefined,
        area_covered: property.area_covered || undefined,
        area_total: property.area_total || undefined,
        featured: property.featured,
        active: property.active,
      })
      
      if (property.images) {
        setImages(property.images.map(img => img.url))
      }
    }
  }, [property, reset])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`
        const filePath = `properties/${fileName}`

        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(filePath, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath)

        return publicUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setImages(prev => [...prev, ...uploadedUrls])
    } catch (error) {
      console.error('Error uploading images:', error)
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleFormSubmit = async (data: PropertyFormData) => {
    await onSubmit(data)
  }

  const watchedType = watch('type')
  const watchedOperation = watch('operation')

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {property ? 'Editar Propiedad' : 'Nueva Propiedad'}
            </h1>
            <p className="text-gray-600">
              {property ? 'Modifica los datos de la propiedad' : 'Completa la información de la nueva propiedad'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="pricing">Precios</TabsTrigger>
            <TabsTrigger value="images">Imágenes</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      placeholder="Ej: Casa en Barrio Norte"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      {...register('city')}
                      placeholder="Ciudad"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    {...register('address')}
                    placeholder="Dirección completa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <textarea
                    id="description"
                    {...register('description')}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción detallada de la propiedad..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Propiedad *</Label>
                    <Select 
                      value={watchedType} 
                      onValueChange={(value) => setValue('type', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="departamento">Departamento</SelectItem>
                        <SelectItem value="ph">PH</SelectItem>
                        <SelectItem value="lote">Lote</SelectItem>
                        <SelectItem value="local">Local</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="operation">Operación *</Label>
                    <Select 
                      value={watchedOperation} 
                      onValueChange={(value) => setValue('operation', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar operación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="venta">Venta</SelectItem>
                        <SelectItem value="alquiler">Alquiler</SelectItem>
                        <SelectItem value="temporal">Alquiler Temporal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      {...register('featured')}
                      className="rounded"
                    />
                    <Label htmlFor="featured">Propiedad Destacada</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="active"
                      {...register('active')}
                      className="rounded"
                    />
                    <Label htmlFor="active">Activa</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Propiedad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {watchedType !== 'lote' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rooms">Habitaciones</Label>
                      <Input
                        id="rooms"
                        type="number"
                        min="0"
                        {...register('rooms', { valueAsNumber: true })}
                        placeholder="Número de habitaciones"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Baños</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="0"
                        {...register('bathrooms', { valueAsNumber: true })}
                        placeholder="Número de baños"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {watchedType !== 'lote' && (
                    <div className="space-y-2">
                      <Label htmlFor="area_covered">Superficie Cubierta (m²)</Label>
                      <Input
                        id="area_covered"
                        type="number"
                        min="0"
                        step="0.1"
                        {...register('area_covered', { valueAsNumber: true })}
                        placeholder="Metros cuadrados cubiertos"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="area_total">Superficie Total (m²)</Label>
                    <Input
                      id="area_total"
                      type="number"
                      min="0"
                      step="0.1"
                      {...register('area_total', { valueAsNumber: true })}
                      placeholder="Metros cuadrados totales"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Precios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price_usd">
                      Precio en USD {watchedOperation === 'alquiler' && '(por mes)'}
                    </Label>
                    <Input
                      id="price_usd"
                      type="number"
                      min="0"
                      step="1"
                      {...register('price_usd', { valueAsNumber: true })}
                      placeholder="Precio en dólares"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price_ars">
                      Precio en ARS {watchedOperation === 'alquiler' && '(por mes)'}
                    </Label>
                    <Input
                      id="price_ars"
                      type="number"
                      min="0"
                      step="1"
                      {...register('price_ars', { valueAsNumber: true })}
                      placeholder="Precio en pesos"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Puedes especificar el precio en una o ambas monedas. 
                    Si no especificas precio, se mostrará "A consultar".
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images */}
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Imágenes de la Propiedad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click para subir</span> imágenes
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG hasta 10MB cada una</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImages}
                      />
                    </label>
                  </div>

                  {uploadingImages && (
                    <div className="text-center">
                      <div className="inline-flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Subiendo imágenes...
                      </div>
                    </div>
                  )}

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {index === 0 && (
                            <Badge className="absolute bottom-2 left-2 bg-blue-600">
                              Principal
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {property ? 'Actualizar' : 'Crear'} Propiedad
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
