import { Routes, Route } from 'react-router-dom'
import { SupabaseProvider } from './providers/SupabaseProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import Layout from './components/layout/Layout'

// Public pages
import HomePage from './pages/HomePage'
import PropertiesPage from './pages/PropertiesPage'
import PropertyDetailsPage from './pages/PropertyDetailsPage'
import DevelopmentsPage from './pages/DevelopmentsPage'
import DevelopmentDetailsPage from './pages/DevelopmentDetailsPage'
import ContactPage from './pages/ContactPage'
import CompanyPage from './pages/CompanyPage'
import ValuationsPage from './pages/ValuationsPage'

// Auth pages
import SignInPage from './pages/auth/SignInPage'

// Protected pages
import FavoritesPage from './pages/FavoritesPage'
import AdminPage from './pages/admin/AdminPage'
import CreatePropertyPage from './pages/admin/CreatePropertyPage'
import EditPropertyPage from './pages/admin/EditPropertyPage'
import PropertiesManagementPage from './pages/admin/PropertiesManagementPage'

// Setup pages
import ConfigAdminPage from './pages/setup/ConfigAdminPage'
import ConfigDbPage from './pages/setup/ConfigDbPage'
import DebugAdminPage from './pages/setup/DebugAdminPage'
import SetupAdminPage from './pages/setup/SetupAdminPage'
import DebugPage from './pages/DebugPage'
import TestConnectionPage from './pages/TestConnectionPage'
import DebugConnectionPage from './pages/DebugConnectionPage'

// Builder.io page
import BuilderPage from './pages/BuilderPage'
import AuthDebugPage from './pages/AuthDebugPage'

function App() {
  return (
    <SupabaseProvider>
      <Routes>
        {/* Setup routes (no layout) */}
        <Route path="/configurar-admin" element={<ConfigAdminPage />} />
        <Route path="/configurar-db" element={<ConfigDbPage />} />
        <Route path="/debug-admin" element={<DebugAdminPage />} />
        <Route path="/setup-admin" element={<SetupAdminPage />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/test-connection" element={<TestConnectionPage />} />
        <Route path="/debug-connection" element={<DebugConnectionPage />} />
        <Route path="/auth-debug" element={<AuthDebugPage />} />
        
        {/* Auth routes (no layout) */}
        <Route path="/auth/sign-in" element={<SignInPage />} />
        
        {/* Main routes with layout */}
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="propiedades" element={<PropertiesPage />} />
          <Route path="propiedad/:id" element={<PropertyDetailsPage />} />
          <Route path="emprendimientos" element={<DevelopmentsPage />} />
          <Route path="emprendimientos/:id" element={<DevelopmentDetailsPage />} />
          <Route path="contacto" element={<ContactPage />} />
          <Route path="la-empresa" element={<CompanyPage />} />
          <Route path="tasaciones" element={<ValuationsPage />} />
          
          {/* Protected routes */}
          <Route path="favoritos" element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="admin" element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } />
          
          {/* Builder.io dynamic pages */}
          <Route path="*" element={<BuilderPage />} />
        </Route>
      </Routes>
    </SupabaseProvider>
  )
}

export default App
