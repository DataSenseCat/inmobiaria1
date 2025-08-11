-- Script para configurar el primer usuario administrador
-- Ejecutar este script en Supabase SQL Editor DESPUÉS de registrar un usuario

-- Paso 1: Crear las tablas necesarias si no existen
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla users si no existe
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de leads si no existe
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
    property_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Configurar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Políticas para users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can modify users" ON users;
CREATE POLICY "Admins can modify users" ON users
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- Políticas para leads
DROP POLICY IF EXISTS "Admins can view all leads" ON leads;
CREATE POLICY "Admins can view all leads" ON leads
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can modify leads" ON leads;
CREATE POLICY "Admins can modify leads" ON leads
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
CREATE POLICY "Anyone can insert leads" ON leads
    FOR INSERT
    WITH CHECK (true);

-- Función para crear perfil de usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        COALESCE(new.raw_user_meta_data->>'role', 'user')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Paso 2: Convertir el primer usuario registrado en admin
-- IMPORTANTE: Ejecuta esta línea SOLO después de registrar tu usuario

-- Opción A: Si conoces tu email, reemplaza 'tu-email@ejemplo.com' con tu email real
-- UPDATE users SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';

-- Opción B: Convertir el primer usuario en admin (usar solo si eres el único usuario)
-- UPDATE users SET role = 'admin' WHERE created_at = (SELECT MIN(created_at) FROM users);

-- Paso 3: Verificar que el admin se creó correctamente
-- SELECT * FROM users WHERE role = 'admin';

-- Mensaje final
DO $$
BEGIN
    RAISE NOTICE '✅ Configuración de base de datos completada!';
    RAISE NOTICE '📋 Próximos pasos:';
    RAISE NOTICE '1. Regístrate en la aplicación con tu email';
    RAISE NOTICE '2. Ejecuta una de estas líneas según tu caso:';
    RAISE NOTICE '   - UPDATE users SET role = ''admin'' WHERE email = ''tu-email@ejemplo.com'';';
    RAISE NOTICE '   - UPDATE users SET role = ''admin'' WHERE created_at = (SELECT MIN(created_at) FROM users);';
    RAISE NOTICE '3. Verifica con: SELECT * FROM users WHERE role = ''admin'';';
END $$;
