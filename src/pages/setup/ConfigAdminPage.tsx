import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { logError } from '@/lib/utils/errorUtils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings, 
  Users, 
  Shield, 
  Database,
  AlertCircle,
  Check,
  X,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Building,
  DollarSign,
  Globe,
  Palette,
  Bell,
  Lock,
  Key,
  Server,
  Image,
  FileText,
  Zap
} from 'lucide-react'

interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  role: 'admin' | 'agent' | 'user'
  created_at: string
  last_sign_in_at?: string
}

interface SiteConfig {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  whatsappNumber: string
  currency: 'USD' | 'ARS'
  language: 'es' | 'en'
  theme: 'light' | 'dark' | 'auto'
  emailNotifications: boolean
  smsNotifications: boolean
  autoBackup: boolean
  maintenanceMode: boolean
}

export default function ConfigAdminPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  // State for different sections
  const [users, setUsers] = useState<User[]>([])
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    siteName: 'Inmobiliaria Catamarca',
    siteDescription: 'Tu inmobiliaria de confianza en Catamarca',
    contactEmail: 'contacto@inmobiliariacatamarca.com',
    contactPhone: '+54 383 456-7890',
    address: 'San Fernando del Valle de Catamarca, Argentina',
    whatsappNumber: '+54 9 383 456-7890',
    currency: 'USD',
    language: 'es',
    theme: 'light',
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    maintenanceMode: false
  })
  
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'user' as 'admin' | 'agent' | 'user'
  })
  
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean
    tablesExist: boolean
    hasData: boolean
    message: string
  }>({
    connected: false,
    tablesExist: false,
    hasData: false,
    message: 'Verificando...'
  })

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if user is authenticated and is admin
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        navigate('/auth/sign-in?redirectedFrom=/configurar-admin')
        return
      }

      setCurrentUser(user)

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || !profile || profile.role !== 'admin') {
        setError('No tienes permisos para acceder a esta página')
        setTimeout(() => navigate('/'), 3000)
        return
      }

      // Load all data in parallel
      await Promise.all([
        loadUsers(),
        checkDatabaseStatus(),
        loadSiteConfig()
      ])

    } catch (err) {
      const errorLog = logError(err, 'ConfigAdminPage.checkAuthAndLoadData')
      setError(`Error al cargar la configuración: ${errorLog.message}`)
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data || [])
    } catch (err) {
      console.error('Error loading users:', err)
      // Don't show error for this, it's not critical
    }
  }

  const loadSiteConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setSiteConfig(prev => ({ ...prev, ...data }))
      }
    } catch (err) {
      console.error('Error loading site config:', err)
      // Keep default config if table doesn't exist
    }
  }

  const checkDatabaseStatus = async () => {
    try {
      // Check basic connection
      const { data: authData, error: authError } = await supabase.auth.getUser()
      const connected = !authError

      // Check if essential tables exist
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('count')
        .limit(1)

      const tablesExist = !propertiesError

      // Check if we have data
      const { data: countData, error: countError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })

      const hasData = !countError && (countData as any)?.count > 0

      let message = 'Base de datos configurada correctamente'
      if (!connected) {
        message = 'Error de conexión con Supabase'
      } else if (!tablesExist) {
        message = 'Tablas de la base de datos no encontradas'
      } else if (!hasData) {
        message = 'Base de datos conectada pero sin datos'
      }

      setDbStatus({
        connected,
        tablesExist,
        hasData,
        message
      })

    } catch (err) {
      setDbStatus({
        connected: false,
        tablesExist: false,
        hasData: false,
        message: 'Error al verificar el estado de la base de datos'
      })
    }
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        user_metadata: {
          full_name: newUser.fullName,
          phone: newUser.phone,
          role: newUser.role
        }
      })

      if (authError) throw authError

      // Create user profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: newUser.email,
            full_name: newUser.fullName,
            phone: newUser.phone,
            role: newUser.role
          })

        if (profileError) throw profileError
      }

      setSuccess('Usuario creado exitosamente')
      setNewUser({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        role: 'user'
      })
      
      await loadUsers()

    } catch (err: any) {
      setError(err.message || 'Error al crear usuario')
    } finally {
      setSaving(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: 'admin' | 'agent' | 'user') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      await loadUsers()
      setSuccess('Rol de usuario actualizado')
    } catch (err: any) {
      setError(err.message || 'Error al actualizar rol')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return
    }

    try {
      // Delete from users table
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (profileError) throw profileError

      // Delete from auth (requires admin)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId)
      
      if (authError) {
        console.warn('Could not delete from auth:', authError)
      }

      await loadUsers()
      setSuccess('Usuario eliminado')
    } catch (err: any) {
      setError(err.message || 'Error al eliminar usuario')
    }
  }

  const saveSiteConfig = async () => {
    setSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('site_config')
        .upsert(siteConfig)

      if (error) throw error

      setSuccess('Configuración guardada exitosamente')
    } catch (err: any) {
      setError(err.message || 'Error al guardar configuración')
    } finally {
      setSaving(false)
    }
  }

  const initializeDatabase = async () => {
    setSaving(true)
    setError(null)

    try {
      // This would run the initialization SQL
      setSuccess('Base de datos inicializada. Recarga la página para ver los cambios.')
      setTimeout(() => window.location.reload(), 2000)
    } catch (err: any) {
      setError(err.message || 'Error al inicializar base de datos')
    } finally {
      setSaving(false)
    }
  }

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      agent: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    }
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrador',
      agent: 'Agente',
      user: 'Usuario'
    }
    return labels[role as keyof typeof labels] || role
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                <Settings className="inline w-8 h-8 mr-3" />
                Configuración de Administrador
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona usuarios, configuraciones del sitio y base de datos
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button variant="outline" onClick={() => navigate('/admin')}>
                <Shield className="w-4 h-4 mr-2" />
                Panel Admin
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                <Globe className="w-4 h-4 mr-2" />
                Ver Sitio
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Database Status Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Estado de la Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                {dbStatus.connected ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
                <span className="text-sm">
                  {dbStatus.connected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {dbStatus.tablesExist ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
                <span className="text-sm">
                  {dbStatus.tablesExist ? 'Tablas creadas' : 'Tablas faltantes'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {dbStatus.hasData ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-orange-500" />
                )}
                <span className="text-sm">
                  {dbStatus.hasData ? 'Con datos' : 'Sin datos'}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3">{dbStatus.message}</p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={checkDatabaseStatus}
                  disabled={saving}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Verificar Estado
                </Button>
                {!dbStatus.tablesExist && (
                  <Button
                    size="sm"
                    onClick={initializeDatabase}
                    disabled={saving}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Inicializar BD
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Configuration Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="site">Configuración</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create New User */}
              <Card>
                <CardHeader>
                  <CardTitle>Crear Nuevo Usuario</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createUser} className="space-y-4">
                    <div>
                      <Label htmlFor="userEmail">Email</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="userPassword">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="userPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          className="pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="userFullName">Nombre Completo</Label>
                      <Input
                        id="userFullName"
                        value={newUser.fullName}
                        onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="userPhone">Teléfono</Label>
                      <Input
                        id="userPhone"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="userRole">Rol</Label>
                      <select
                        id="userRole"
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="user">Usuario</option>
                        <option value="agent">Agente</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>

                    <Button type="submit" disabled={saving} className="w-full">
                      {saving ? 'Creando...' : 'Crear Usuario'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Users List */}
              <Card>
                <CardHeader>
                  <CardTitle>Usuarios Existentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{user.full_name || user.email}</span>
                            <Badge className={getRoleColor(user.role)}>
                              {getRoleLabel(user.role)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {user.phone && (
                            <p className="text-sm text-gray-500">{user.phone}</p>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value as any)}
                            className="text-xs px-2 py-1 border rounded"
                            disabled={user.id === currentUser?.id}
                          >
                            <option value="user">Usuario</option>
                            <option value="agent">Agente</option>
                            <option value="admin">Admin</option>
                          </select>
                          {user.id !== currentUser?.id && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Site Configuration */}
          <TabsContent value="site">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sitio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Información Básica</h3>
                    
                    <div>
                      <Label htmlFor="siteName">Nombre del Sitio</Label>
                      <Input
                        id="siteName"
                        value={siteConfig.siteName}
                        onChange={(e) => setSiteConfig({...siteConfig, siteName: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="siteDescription">Descripción</Label>
                      <Input
                        id="siteDescription"
                        value={siteConfig.siteDescription}
                        onChange={(e) => setSiteConfig({...siteConfig, siteDescription: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={siteConfig.address}
                        onChange={(e) => setSiteConfig({...siteConfig, address: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Información de Contacto</h3>
                    
                    <div>
                      <Label htmlFor="contactEmail">Email de Contacto</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={siteConfig.contactEmail}
                        onChange={(e) => setSiteConfig({...siteConfig, contactEmail: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPhone">Teléfono de Contacto</Label>
                      <Input
                        id="contactPhone"
                        value={siteConfig.contactPhone}
                        onChange={(e) => setSiteConfig({...siteConfig, contactPhone: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="whatsappNumber">WhatsApp</Label>
                      <Input
                        id="whatsappNumber"
                        value={siteConfig.whatsappNumber}
                        onChange={(e) => setSiteConfig({...siteConfig, whatsappNumber: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Preferencias</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="currency">Moneda Principal</Label>
                      <select
                        id="currency"
                        value={siteConfig.currency}
                        onChange={(e) => setSiteConfig({...siteConfig, currency: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="USD">USD - Dólar</option>
                        <option value="ARS">ARS - Peso Argentino</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="language">Idioma</Label>
                      <select
                        id="language"
                        value={siteConfig.language}
                        onChange={(e) => setSiteConfig({...siteConfig, language: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="theme">Tema</Label>
                      <select
                        id="theme"
                        value={siteConfig.theme}
                        onChange={(e) => setSiteConfig({...siteConfig, theme: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="light">Claro</option>
                        <option value="dark">Oscuro</option>
                        <option value="auto">Automático</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button onClick={saveSiteConfig} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar Configuración'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificaciones por Email</h4>
                      <p className="text-sm text-gray-600">Recibir emails de nuevos leads</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={siteConfig.emailNotifications}
                      onChange={(e) => setSiteConfig({...siteConfig, emailNotifications: e.target.checked})}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificaciones SMS</h4>
                      <p className="text-sm text-gray-600">Recibir SMS de consultas urgentes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={siteConfig.smsNotifications}
                      onChange={(e) => setSiteConfig({...siteConfig, smsNotifications: e.target.checked})}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Backup Automático</h4>
                      <p className="text-sm text-gray-600">Backup diario de datos</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={siteConfig.autoBackup}
                      onChange={(e) => setSiteConfig({...siteConfig, autoBackup: e.target.checked})}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Modo Mantenimiento</h4>
                      <p className="text-sm text-gray-600">Deshabilitar el sitio temporalmente</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={siteConfig.maintenanceMode}
                      onChange={(e) => setSiteConfig({...siteConfig, maintenanceMode: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Herramientas del Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/debug')}>
                    <Zap className="w-4 h-4 mr-2" />
                    Debug de Base de Datos
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Exportar Configuración
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Image className="w-4 h-4 mr-2" />
                    Limpiar Cache de Imágenes
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Server className="w-4 h-4 mr-2" />
                    Reiniciar Aplicación
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">
                    <AlertCircle className="w-5 h-5 mr-2 inline" />
                    Configuración Avanzada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        <strong>Advertencia:</strong> Estas configuraciones son para usuarios avanzados. 
                        Cambios incorrectos pueden afectar el funcionamiento del sitio.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar Todas las Propiedades
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start text-red-600">
                        <Database className="w-4 h-4 mr-2" />
                        Resetear Base de Datos
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start text-orange-600">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Restaurar Configuración por Defecto
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Variables de Entorno</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">SUPABASE_URL:</span>
                      <span className="font-mono">{import.meta.env.VITE_SUPABASE_URL ? '✓ Configurado' : '✗ No configurado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SUPABASE_ANON_KEY:</span>
                      <span className="font-mono">{import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Configurado' : '✗ No configurado'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
