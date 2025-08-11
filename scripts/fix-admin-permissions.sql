-- ================================================
-- SCRIPT COMPLETO PARA SOLUCIONAR PERMISOS DE ADMIN
-- ================================================
-- Ejecuta este script en Supabase SQL Editor para arreglar todos los problemas

-- 1. CREAR TABLA USERS SI NO EXISTE
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREAR TABLA DEVELOPMENTS SI NO EXISTE
-- ================================================
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

-- 3. CREAR TABLA DEVELOPMENT_IMAGES SI NO EXISTE
-- ================================================
CREATE TABLE IF NOT EXISTS development_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    development_id UUID REFERENCES developments(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONFIGURAR RLS (ROW LEVEL SECURITY)
-- ================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE developments ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_images ENABLE ROW LEVEL SECURITY;

-- 5. ELIMINAR POLÍTICAS EXISTENTES PARA RECREARLAS
-- ================================================

-- Users policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Properties policies
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON properties;
DROP POLICY IF EXISTS "Admins can manage properties" ON properties;
DROP POLICY IF EXISTS "Agents can manage own properties" ON properties;

-- Developments policies
DROP POLICY IF EXISTS "Developments are viewable by everyone" ON developments;
DROP POLICY IF EXISTS "Admins can manage developments" ON developments;

-- Development images policies
DROP POLICY IF EXISTS "Development images are viewable by everyone" ON development_images;
DROP POLICY IF EXISTS "Admins can manage development images" ON development_images;

-- 6. CREAR NUEVAS POLÍTICAS MEJORADAS
-- ================================================

-- === USERS POLICIES ===
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can manage all users" ON users
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- === PROPERTIES POLICIES ===
CREATE POLICY "Properties are viewable by everyone" ON properties
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage all properties" ON properties
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Agents can manage own properties" ON properties
    FOR ALL USING (
        agent_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- === DEVELOPMENTS POLICIES ===
CREATE POLICY "Developments are viewable by everyone" ON developments
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage developments" ON developments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- === DEVELOPMENT IMAGES POLICIES ===
CREATE POLICY "Development images are viewable by everyone" ON development_images
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage development images" ON development_images
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- 7. CREAR FUNCIÓN PARA MANEJAR NUEVOS USUARIOS
-- ================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. CREAR TRIGGER PARA NUEVOS USUARIOS
-- ================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. CONVERTIR USUARIO ACTUAL EN ADMIN
-- ================================================
-- Esta parte convierte al usuario actualmente autenticado en admin
-- Nota: Esto solo funciona si ejecutas el script mientras estás autenticado

DO $$
BEGIN
    -- Verificar si hay un usuario autenticado
    IF auth.uid() IS NOT NULL THEN
        -- Obtener datos del usuario autenticado
        INSERT INTO users (id, email, role)
        SELECT 
            auth.uid(),
            COALESCE(auth.email(), 'admin@inmobiliaria.com'),
            'admin'
        ON CONFLICT (id) 
        DO UPDATE SET 
            role = 'admin',
            updated_at = NOW();
            
        RAISE NOTICE 'Usuario % convertido a admin', auth.uid();
    ELSE
        RAISE NOTICE 'No hay usuario autenticado. Debes estar logueado para convertirte en admin automáticamente.';
    END IF;
END $$;

-- 10. CREAR ÍNDICES PARA MEJOR RENDIMIENTO
-- ================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(active);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_developments_status ON developments(status);
CREATE INDEX IF NOT EXISTS idx_developments_featured ON developments(featured);
CREATE INDEX IF NOT EXISTS idx_developments_active ON developments(active);

-- 11. INSERTAR DATOS DE EJEMPLO PARA DEVELOPMENTS
-- ================================================
INSERT INTO developments (name, description, address, city, total_units, available_units, price_from, price_to, delivery_date, status, featured, active)
VALUES 
    ('Complejo Residencial Las Palmeras', 'Moderno complejo residencial con 48 unidades, amenities y espacios verdes. Ubicado en la zona más exclusiva de Catamarca.', 'Av. Güemes 2500', 'San Fernando del Valle de Catamarca', 48, 12, 85000, 150000, '2025-06-30', 'construction', true, true),
    ('Torres del Valle', 'Dos torres residenciales de 12 pisos cada una, con vista panorámica a las sierras. Departamentos de 1, 2 y 3 dormitorios.', 'República 1800', 'San Fernando del Valle de Catamarca', 96, 72, 95000, 180000, '2025-12-31', 'planning', true, true),
    ('Barrio Cerrado El Mirador', 'Exclusivo barrio cerrado con 24 lotes de 400 a 800 m². Seguridad 24hs, club house y espacios recreativos.', 'Ruta 38 Km 15', 'San Fernando del Valle de Catamarca', 24, 8, 45000, 75000, '2024-08-31', 'completed', false, true)
ON CONFLICT (id) DO NOTHING;

-- 12. VERIFICACIÓN FINAL
-- ================================================
-- Esta sección muestra el estado final de la configuración

DO $$
DECLARE
    user_count INTEGER;
    admin_count INTEGER;
    props_count INTEGER;
    devs_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO admin_count FROM users WHERE role = 'admin';
    SELECT COUNT(*) INTO props_count FROM properties;
    SELECT COUNT(*) INTO devs_count FROM developments;
    
    RAISE NOTICE '=== CONFIGURACIÓN COMPLETADA ===';
    RAISE NOTICE 'Usuarios totales: %', user_count;
    RAISE NOTICE 'Usuarios admin: %', admin_count;
    RAISE NOTICE 'Propiedades: %', props_count;
    RAISE NOTICE 'Emprendimientos: %', devs_count;
    
    IF admin_count > 0 THEN
        RAISE NOTICE '✅ Al menos un admin configurado';
    ELSE
        RAISE NOTICE '⚠️  No hay usuarios admin. Ejecuta este script mientras estés autenticado o usa la interfaz web.';
    END IF;
END $$;

-- ================================================
-- INSTRUCCIONES FINALES:
-- ================================================
-- 1. Ejecuta este script completo en Supabase SQL Editor
-- 2. Asegúrate de estar autenticado cuando lo ejecutes
-- 3. Recarga la aplicación después de ejecutar el script
-- 4. Si sigues teniendo problemas, ve a /setup-admin
-- ================================================
