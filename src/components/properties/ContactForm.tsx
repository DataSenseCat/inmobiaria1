interface ContactFormProps {
  propertyId: string
  propertyTitle: string
}

export default function ContactForm({ propertyId }: ContactFormProps) {
  return (
    <div className="bg-white rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4">Contactar por esta propiedad</h3>
      <p className="text-gray-600 text-sm">ID: {propertyId}</p>
      <p className="text-gray-600">Formulario de contacto en desarrollo...</p>
    </div>
  )
}
