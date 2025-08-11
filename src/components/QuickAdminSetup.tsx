import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Copy, ExternalLink, User, Database, RefreshCw } from 'lucide-react'

export default function QuickAdminSetup() {
  const [copied, setCopied] = useState(false)

  const sqlScript = `-- EJECUTA ESTE SCRIPT EN SUPABASE SQL EDITOR MIENTRAS ESTÉS AUTENTICADO
-- Esto creará tu usuario admin y todas las tablas necesarias

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

-- 2. Convertir tu usuario actual en admin
INSERT INTO users (id, email, role)
SELECT 
    auth.uid(),
    COALESCE(auth.email(), 'admin@inmobiliaria.com'),
    'admin'
ON CONFLICT (id) 
DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();

-- 3. Crear tabla developments
CREATE TABLE IF NOT EXISTS developments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    city TEXT NOT NULL,
    total_units INTEGER,
    available_units INTEGER,
    price_from DECIMAL,
    price_to DECIMAL,
    delivery_date DATE,
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'construction', 'completed', 'delivered')),
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    agent_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Habilitar RLS y crear políticas básicas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE developments ENABLE ROW LEVEL SECURITY;

-- Políticas para properties
DROP POLICY IF EXISTS "Admins can manage all properties" ON properties;
CREATE POLICY "Admins can manage all properties" ON properties
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Políticas para developments  
DROP POLICY IF EXISTS "Developments are viewable by everyone" ON developments;
DROP POLICY IF EXISTS "Admins can manage developments" ON developments;
CREATE POLICY "Developments are viewable by everyone" ON developments
    FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage developments" ON developments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ¡Listo! Ahora recarga la página.`

  const copyScript = () => {
    navigator.clipboard.writeText(sqlScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <AlertCircle className="h-5 w-5" />
            <span>Configuración Rápida de Administrador</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700">
            Para crear propiedades y usar todas las funciones del panel admin, necesitas:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>1. Estar Autenticado</span>
              </h3>
              <p className="text-sm text-gray-600">
                Inicia sesión o crea una cuenta en el sistema.
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Necesario para continuar
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>2. Ser Usuario Admin</span>
              </h3>
              <p className="text-sm text-gray-600">
                Tu cuenta necesita permisos de administrador en la base de datos.
              </p>
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                Se configura con el script SQL
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Script SQL de Configuración</span>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={copyScript}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open('https://xtcdvnzcryshjwwggfrk.supabase.co/project/default/sql', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir SQL Editor
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-80 border">
            {sqlScript}
          </pre>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span>Instrucciones Paso a Paso</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-3 text-sm text-green-700">
            <li>
              <strong>Autentícate</strong>: Si no has iniciado sesión, hazlo primero
              <div className="mt-1 ml-6">
                <Button 
                  size="sm" 
                  onClick={() => window.location.href = '/auth/sign-in'}
                  className="text-xs"
                >
                  Ir a Iniciar Sesión
                </Button>
              </div>
            </li>
            <li>
              <strong>Copia el script</strong>: Usa el botón "Copiar" para copiar todo el código SQL
            </li>
            <li>
              <strong>Abre Supabase</strong>: Haz clic en "Abrir SQL Editor" para ir a Supabase
            </li>
            <li>
              <strong>Ejecuta el script</strong>: Pega el código en el editor y presiona Ctrl+Enter (o Cmd+Enter en Mac)
            </li>
            <li>
              <strong>Recarga esta página</strong>: Después de ejecutar el script, recarga la aplicación
              <div className="mt-1 ml-6">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="text-xs"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Recargar Ahora
                </Button>
              </div>
            </li>
          </ol>
          
          <div className="mt-4 p-3 bg-green-100 rounded border-l-4 border-green-400">
            <p className="text-green-800 text-sm font-medium">
              💡 <strong>Importante:</strong> Debes estar autenticado en esta aplicación cuando ejecutes el script para que funcione correctamente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
