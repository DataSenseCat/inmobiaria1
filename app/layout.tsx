import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Inmobiliaria Catamarca - Propiedades en Venta y Alquiler',
  description: 'Encuentra las mejores propiedades en Catamarca. Casas, departamentos, lotes y locales comerciales en venta y alquiler.',
  keywords: 'inmobiliaria, catamarca, propiedades, venta, alquiler, casas, departamentos',
  openGraph: {
    title: 'Inmobiliaria Catamarca',
    description: 'Las mejores propiedades en Catamarca',
    type: 'website',
    locale: 'es_AR'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-AR">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
