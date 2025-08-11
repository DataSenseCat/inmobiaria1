import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Database, Zap, ArrowRight, Copy } from 'lucide-react'

export default function QuickStart() {
  const demoCredentials = {
    email: 'demo@example.com',
    password: 'demo123456'
  }

  const copyCredentials = () => {
    const text = `Email: ${demoCredentials.email}\nContraseña: ${demoCredentials.password}`
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Zap className="h-5 w-5" />
            <span>Inicio Rápido - 2 Opciones</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Option 1: Demo Admin */}
          <div className="p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-bold">OPCIÓN 1</span>
                <User className="h-4 w-4" />
                <span>Demo Rápido (Recomendado)</span>
              </h3>
              <Badge className="bg-blue-100 text-blue-800">¡Más Fácil!</Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Crea instantáneamente un usuario administrador de prueba con un solo clic.
            </p>
            
            <div className="flex space-x-2 mb-4">
              <Button onClick={() => window.location.href = '/demo-admin'}>
                <Zap className="h-4 w-4 mr-2" />
                Crear Admin Demo
              </Button>
            </div>
            
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              Esto creará automáticamente un usuario admin y configurará la base de datos.
            </div>
          </div>

          {/* Option 2: Manual Setup */}
          <div className="p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center space-x-2">
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-bold">OPCIÓN 2</span>
                <Database className="h-4 w-4" />
                <span>Configuración Manual</span>
              </h3>
              <Badge variant="outline">Más Control</Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Si ya tienes una cuenta o quieres usar tu propio email:
            </p>
            
            <ol className="list-decimal list-inside space-y-2 text-sm mb-4">
              <li>Inicia sesión o crea una cuenta</li>
              <li>Ejecuta el script SQL en Supabase</li>
              <li>Recarga la página</li>
            </ol>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/auth/sign-in'}
              >
                Ir a Login
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://xtcdvnzcryshjwwggfrk.supabase.co/project/default/sql', '_blank')}
              >
                SQL Editor
              </Button>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2 flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Credenciales de Demo</span>
            </h4>
            <div className="bg-gray-50 p-3 rounded font-mono text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div><strong>Email:</strong> {demoCredentials.email}</div>
                  <div><strong>Contraseña:</strong> {demoCredentials.password}</div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={copyCredentials}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Puedes usar estas credenciales si el botón de demo no funciona.
            </p>
          </div>

          {/* Next Steps */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2 flex items-center space-x-2">
              <ArrowRight className="h-4 w-4" />
              <span>Una vez que seas admin, podrás:</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>✅ Crear nuevas propiedades</li>
              <li>✅ Editar propiedades existentes</li>
              <li>✅ Eliminar propiedades</li>
              <li>✅ Gestionar emprendimientos</li>
              <li>✅ Ver y responder leads</li>
              <li>✅ Exportar datos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
