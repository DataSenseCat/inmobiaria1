import { useState, useEffect } from 'react'
import { useSupabase } from '@/providers/SupabaseProvider'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Database, 
  User, 
  Shield, 
  Copy,
  ExternalLink,
  RefreshCw
} from 'lucide-react'

interface DiagnosisResult {
  hasUserRecord: boolean
  isAdmin: boolean
  tablesExist: {
    users: boolean
    properties: boolean
    developments: boolean
  }
  canCreateProperty: boolean
  errorMessage?: string
}

export default function AdminDiagnosis() {
  const { user, loading } = useSupabase()
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const [diagnosisLoading, setDiagnosisLoading] = useState(false)
  const [showSqlScript, setShowSqlScript] = useState(false)

  const sqlScript = `-- SCRIPT COMPLETO PARA SOLUCIONAR PERMISOS DE ADMIN
-- Ejecuta este script en Supabase SQL Editor mientras estés autenticado

-- 1. Crear tabla users si no existe
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Convertir usuario actual en admin
DO $$
BEGIN
    IF auth.uid() IS NOT NULL THEN
        INSERT INTO users (id, email, role)
        SELECT 
            auth.uid(),
            COALESCE(auth.email(), 'admin@inmobiliaria.com'),
            'admin'
        ON CONFLICT (id) 
        DO UPDATE SET 
            role = 'admin',
            updated_at = NOW();
        RAISE NOTICE 'Usuario convertido a admin';
    END IF;
END $$;

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

-- 4. Habilitar RLS y crear políticas
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
    );`

  const runDiagnosis = async () => {
    if (!user) return

    setDiagnosisLoading(true)
    
    try {
      const result: DiagnosisResult = {
        hasUserRecord: false,
        isAdmin: false,
        tablesExist: {
          users: false,
          properties: false,
          developments: false
        },
        canCreateProperty: false
      }

      // Check if user exists in users table
      try {
        const { data: userRecord, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!userError && userRecord) {
          result.hasUserRecord = true
          result.isAdmin = userRecord.role === 'admin'
        }
      } catch (err) {
        console.log('User record check failed:', err)
      }

      // Check table existence
      const tables = ['users', 'properties', 'developments']
      for (const table of tables) {
        try {
          const { error } = await supabase
            .from(table)
            .select('count')
            .limit(1)
          
          if (!error) {
            result.tablesExist[table as keyof typeof result.tablesExist] = true
          }
        } catch (err) {
          console.log(`Table ${table} check failed:`, err)
        }
      }

      // Test if can create property
      try {
        const { error } = await supabase
          .from('properties')
          .insert({
            title: 'Test Property - DELETE ME',
            city: 'Test City',
            type: 'casa',
            operation: 'venta',
            featured: false,
            active: false // Set as inactive so it doesn't show up
          })
          .select()

        if (!error) {
          result.canCreateProperty = true
          // Delete the test property
          await supabase
            .from('properties')
            .delete()
            .eq('title', 'Test Property - DELETE ME')
        }
      } catch (err) {
        console.log('Property creation test failed:', err)
      }

      setDiagnosis(result)
    } catch (err) {
      setDiagnosis({
        hasUserRecord: false,
        isAdmin: false,
        tablesExist: { users: false, properties: false, developments: false },
        canCreateProperty: false,
        errorMessage: err instanceof Error ? err.message : 'Error desconocido'
      })
    } finally {
      setDiagnosisLoading(false)
    }
  }

  useEffect(() => {
    if (user && !loading) {
      runDiagnosis()
    }
  }, [user, loading])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript)
  }

  if (loading) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Verificando autenticación...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <XCircle className="h-5 w-5" />
            <span>No Autenticado</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700 mb-4">
            Necesitas estar autenticado para diagnosticar los permisos de administrador.
          </p>
          <Button onClick={() => window.location.href = '/auth/sign-in'}>
            Iniciar Sesión
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!diagnosis) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Ejecutando diagnóstico...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasIssues = !diagnosis.hasUserRecord || !diagnosis.isAdmin || !diagnosis.canCreateProperty || !diagnosis.tablesExist.developments

  return (
    <div className="space-y-6">
      <Card className={hasIssues ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${hasIssues ? 'text-orange-800' : 'text-green-800'}`}>
            {hasIssues ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
            <span>Diagnóstico de Permisos de Admin</span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={runDiagnosis}
              disabled={diagnosisLoading}
            >
              {diagnosisLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Actualizar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Status */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Estado del Usuario</span>
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>Autenticado:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Sí
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Registro en DB:</span>
                  <Badge variant={diagnosis.hasUserRecord ? "secondary" : "destructive"} 
                         className={diagnosis.hasUserRecord ? "bg-green-100 text-green-800" : ""}>
                    {diagnosis.hasUserRecord ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    {diagnosis.hasUserRecord ? 'Sí' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Es Admin:</span>
                  <Badge variant={diagnosis.isAdmin ? "secondary" : "destructive"}
                         className={diagnosis.isAdmin ? "bg-green-100 text-green-800" : ""}>
                    {diagnosis.isAdmin ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    {diagnosis.isAdmin ? 'Sí' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Database Status */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Estado de la Base de Datos</span>
              </h3>
              <div className="space-y-1 text-sm">
                {Object.entries(diagnosis.tablesExist).map(([table, exists]) => (
                  <div key={table} className="flex items-center justify-between">
                    <span>Tabla {table}:</span>
                    <Badge variant={exists ? "secondary" : "destructive"}
                           className={exists ? "bg-green-100 text-green-800" : ""}>
                      {exists ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                      {exists ? 'Existe' : 'No existe'}
                    </Badge>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <span>Puede crear propiedades:</span>
                  <Badge variant={diagnosis.canCreateProperty ? "secondary" : "destructive"}
                         className={diagnosis.canCreateProperty ? "bg-green-100 text-green-800" : ""}>
                    {diagnosis.canCreateProperty ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    {diagnosis.canCreateProperty ? 'Sí' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {hasIssues && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Solución</span>
              </h3>
              <p className="text-sm mb-4">
                Para solucionar estos problemas, ejecuta el siguiente script SQL en Supabase mientras estás autenticado:
              </p>
              <div className="flex space-x-2 mb-4">
                <Button 
                  size="sm"
                  onClick={() => setShowSqlScript(!showSqlScript)}
                >
                  {showSqlScript ? 'Ocultar' : 'Mostrar'} Script SQL
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Script
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

              {showSqlScript && (
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-64">
                  {sqlScript}
                </pre>
              )}

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Instrucciones paso a paso:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                  <li>Asegúrate de estar autenticado en esta aplicación</li>
                  <li>Copia el script SQL usando el botón "Copiar Script"</li>
                  <li>Abre el SQL Editor de Supabase</li>
                  <li>Pega y ejecuta el script completo</li>
                  <li>Usa el botón "Actualizar" aquí para verificar los cambios</li>
                </ol>
              </div>
            </div>
          )}

          {!hasIssues && (
            <div className="border-t pt-4">
              <p className="text-green-700 text-sm">
                ✅ ¡Excelente! Tu configuración de administrador está completa. Ahora puedes crear, editar y eliminar propiedades y emprendimientos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
