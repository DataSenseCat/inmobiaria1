import { AlertCircle, Database, User, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SetupInstructions() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const sqlScript = `-- Create developments table and related structures
-- Run this script in Supabase SQL Editor to fix the developments page

-- 1. Create developments table
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
    agent_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create development_images table
CREATE TABLE IF NOT EXISTS development_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    development_id UUID REFERENCES developments(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS on developments
ALTER TABLE developments ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_images ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for developments
DROP POLICY IF EXISTS "Developments are viewable by everyone" ON developments;
CREATE POLICY "Developments are viewable by everyone" ON developments
    FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Admins can manage developments" ON developments;
CREATE POLICY "Admins can manage developments" ON developments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- 5. Create policies for development_images
DROP POLICY IF EXISTS "Development images are viewable by everyone" ON development_images;
CREATE POLICY "Development images are viewable by everyone" ON development_images
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage development images" ON development_images;
CREATE POLICY "Admins can manage development images" ON development_images
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- 6. Add foreign key constraint for agents (if users table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_developments_agent' 
            AND table_name = 'developments'
        ) THEN
            ALTER TABLE developments 
            ADD CONSTRAINT fk_developments_agent 
            FOREIGN KEY (agent_id) REFERENCES users(id);
        END IF;
    END IF;
END $$;

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_developments_status ON developments(status);
CREATE INDEX IF NOT EXISTS idx_developments_featured ON developments(featured);
CREATE INDEX IF NOT EXISTS idx_developments_active ON developments(active);
CREATE INDEX IF NOT EXISTS idx_development_images_development_id ON development_images(development_id);
CREATE INDEX IF NOT EXISTS idx_development_images_order ON development_images(development_id, order_index);

-- 8. Insert sample data (optional)
INSERT INTO developments (name, description, address, city, total_units, available_units, price_from, price_to, delivery_date, status, featured, active)
VALUES 
    ('Complejo Residencial Las Palmeras', 'Moderno complejo residencial con 48 unidades, amenities y espacios verdes. Ubicado en la zona más exclusiva de Catamarca.', 'Av. Güemes 2500', 'San Fernando del Valle de Catamarca', 48, 12, 85000, 150000, '2025-06-30', 'construction', true, true),
    ('Torres del Valle', 'Dos torres residenciales de 12 pisos cada una, con vista panorámica a las sierras. Departamentos de 1, 2 y 3 dormitorios.', 'República 1800', 'San Fernando del Valle de Catamarca', 96, 72, 95000, 180000, '2025-12-31', 'planning', true, true),
    ('Barrio Cerrado El Mirador', 'Exclusivo barrio cerrado con 24 lotes de 400 a 800 m². Seguridad 24hs, club house y espacios recreativos.', 'Ruta 38 Km 15', 'San Fernando del Valle de Catamarca', 24, 8, 45000, 75000, '2024-08-31', 'completed', false, true)
ON CONFLICT (id) DO NOTHING;`

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <AlertCircle className="h-5 w-5" />
            <span>Configuración Requerida</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-orange-700">
            Para usar todas las funciones del sistema, necesitas completar la configuración de la base de datos y crear un usuario administrador.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>1. Configurar Base de Datos</span>
              </h3>
              <p className="text-sm text-gray-600">
                Ejecuta el script SQL en Supabase para crear las tablas necesarias.
              </p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open('https://xtcdvnzcryshjwwggfrk.supabase.co/project/default/sql', '_blank')}
              >
                Abrir SQL Editor
              </Button>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>2. Crear Usuario Admin</span>
              </h3>
              <p className="text-sm text-gray-600">
                Crea una cuenta y configúrala como administrador.
              </p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.location.href = '/setup-admin'}
              >
                Ir a Configuración
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Script SQL para Supabase</span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => copyToClipboard(sqlScript)}
            >
              Copiar Script
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-96">
            {sqlScript}
          </pre>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Instrucciones:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
              <li>Copia el script SQL de arriba</li>
              <li>Ve al <a href="https://xtcdvnzcryshjwwggfrk.supabase.co/project/default/sql" target="_blank" rel="noopener noreferrer" className="underline">SQL Editor de Supabase</a></li>
              <li>Pega el script y ejecuta (Ctrl+Enter)</li>
              <li>Ve a <a href="/setup-admin" className="underline">Configuración de Admin</a> para crear tu usuario</li>
              <li>Recarga esta página para verificar que todo funciona</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span>Después de la configuración</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 mb-4">
            Una vez completada la configuración, podrás:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-green-600">
            <li>Crear y editar propiedades desde el panel de administración</li>
            <li>Ver emprendimientos sin errores de base de datos</li>
            <li>Gestionar usuarios y contenido</li>
            <li>Acceder a todas las funciones del sistema</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
