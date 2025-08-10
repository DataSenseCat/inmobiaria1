import './globals.css'

export const metadata = {
  title: 'Inmobiliaria Catamarca',
  description: 'Propiedades en Catamarca',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-AR">
      <body>
        {children}
      </body>
    </html>
  )
}
