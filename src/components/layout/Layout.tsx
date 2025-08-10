import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { Inter } from '@fontsource/inter'

export default function Layout() {
  return (
    <div className="font-sans">
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
