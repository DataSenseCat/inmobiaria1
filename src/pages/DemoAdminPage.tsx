import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Copy, ExternalLink, User, Database, ArrowRight } from 'lucide-react'

export default function DemoAdminPage() {
  const [copiedItem, setCopiedItem] = useState('')
  const navigate = useNavigate()

  const sqlScript = `-- EJECUTA ESTE SCRIPT EN SUPABASE DESPUÉS DE AUTENTICARTE

-- 1. Crear tabla users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Hacer admin al usuario actual
INSERT INTO users (id, email, role, full_name)
SELECT 
    auth.uid(),
    auth.email(),
    'admin',
    'Administrador'
ON CONFLICT (id) 
DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();

-- 3. Configurar políticas para properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage all properties" ON properties;
CREATE POLICY "Admins can manage all properties" ON properties
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ¡LISTO! Recarga la página del admin.`

  const copyToClipboard = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(itemName)
    setTimeout(() => setCopiedItem(''), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Guía Admin - 3 Pasos Simples</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-bold text-blue-800 mb-2">🎯 OBJETIVO</h3>
            <p className="text-blue-700">
              Convertirte en administrador para poder crear, editar y eliminar propiedades. 
              <strong> NO necesitas emails especiales ni configuraciones complejas.</strong>
            </p>
          </div>

          {/* Step 1 */}
          <div className="bg-white border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">1</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-800 mb-3">Crear Cuenta / Iniciar Sesión</h3>
                <p className="text-green-700 mb-4">
                  Usa <strong>TU PROPIO EMAIL</strong> (cualquier email que tengas). 
                  No importa cuál uses, después el script te hará admin.
                </p>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => navigate('/auth/sign-in')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Ir a Login/Registro
                  </Button>
                  <span className="flex items-center text-green-600 text-sm">
                    ← Usa cualquier email que tengas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">2</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-800 mb-3">Ejecutar Script SQL</h3>
                <p className="text-blue-700 mb-4">
                  Una vez que estés autenticado, ejecuta este script en Supabase:
                </p>
                
                <div className="bg-gray-900 text-green-400 p-4 rounded text-sm font-mono overflow-auto max-h-64 mb-4 border">
                  {sqlScript}
                </div>

                <div className="flex space-x-3">
                  <Button 
                    onClick={() => copyToClipboard(sqlScript, 'script')}
                    variant="outline"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copiedItem === 'script' ? '¡Copiado!' : 'Copiar Script'}
                  </Button>
                  <Button 
                    onClick={() => window.open('https://xtcdvnzcryshjwwggfrk.supabase.co/project/default/sql', '_blank')}
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir SQL Editor
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">3</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-purple-800 mb-3">Acceder al Panel Admin</h3>
                <p className="text-purple-700 mb-4">
                  Después de ejecutar el script, ya serás administrador. ¡Prueba el panel!
                </p>
                <Button 
                  onClick={() => navigate('/admin')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Ir al Panel Admin
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Instructions */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
            <h3 className="font-bold text-yellow-800 mb-3">⚡ INSTRUCCIONES RÁPIDAS</h3>
            <div className="space-y-2 text-yellow-700 text-sm">
              <div className="flex items-center space-x-2">
                <ArrowRight className="h-4 w-4" />
                <span>Ve a <strong>Login</strong> → Crea cuenta con tu email → Entra al sistema</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRight className="h-4 w-4" />
                <span><strong>Copia el script SQL</strong> → Ve a <strong>Supabase SQL Editor</strong> → Pégalo y ejecuta (Ctrl+Enter)</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRight className="h-4 w-4" />
                <span>Ve al <strong>Panel Admin</strong> → ¡Ya puedes crear, editar y eliminar propiedades!</span>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => navigate('/')}>
              🏠 Inicio
            </Button>
            <Button variant="outline" onClick={() => navigate('/auth/sign-in')}>
              🔑 Login/Registro
            </Button>
            <Button variant="outline" onClick={() => window.open('https://xtcdvnzcryshjwwggfrk.supabase.co/project/default/sql', '_blank')}>
              📝 SQL Editor
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              ⚙️ Panel Admin
            </Button>
          </div>

          {/* Final Note */}
          <div className="bg-green-50 border border-green-300 rounded p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">¿Por qué funciona esto?</h4>
                <p className="text-green-700 text-sm">
                  El script SQL toma tu usuario actual (cualquiera que uses) y le da permisos de administrador. 
                  No necesitas emails específicos - funciona con CUALQUIER cuenta que crees.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
