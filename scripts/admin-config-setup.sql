-- SQL para configurar las tablas necesarias para la página de configuración de admin
-- Ejecutar en Supabase SQL Editor

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

-- Crear tabla site_config para configuraciones del sitio
CREATE TABLE IF NOT EXISTS site_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siteName TEXT DEFAULT 'Inmobiliaria Catamarca',
    siteDescription TEXT DEFAULT 'Tu inmobiliaria de confianza en Catamarca',
    contactEmail TEXT DEFAULT 'contacto@inmobiliariacatamarca.com',
    contactPhone TEXT DEFAULT '+54 383 456-7890',
    address TEXT DEFAULT 'San Fernando del Valle de Catamarca, Argentina',
    whatsappNumber TEXT DEFAULT '+54 9 383 456-7890',
    currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'ARS')),
    language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en')),
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    emailNotifications BOOLEAN DEFAULT true,
    smsNotifications BOOLEAN DEFAULT false,
    autoBackup BOOLEAN DEFAULT true,
    maintenanceMode BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para actualizar updated_at en users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Aplicar trigger a site_config
DROP TRIGGER IF EXISTS update_site_config_updated_at ON site_config;
CREATE TRIGGER update_site_config_updated_at
    BEFORE UPDATE ON site_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar configuración por defecto si no existe
INSERT INTO site_config (siteName, siteDescription, contactEmail, contactPhone, address, whatsappNumber)
SELECT 'Inmobiliaria Catamarca', 'Tu inmobiliaria de confianza en Catamarca', 'contacto@inmobiliariacatamarca.com', '+54 383 456-7890', 'San Fernando del Valle de Catamarca, Argentina', '+54 9 383 456-7890'
WHERE NOT EXISTS (SELECT 1 FROM site_config);

-- Políticas RLS para users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver sus propios datos
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Política para que los admins puedan ver todos los usuarios
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Política para que los admins puedan modificar usuarios
CREATE POLICY "Admins can modify users" ON users
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Política para que los usuarios puedan actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- Políticas RLS para site_config
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Política para que todos puedan leer la configuración del sitio
CREATE POLICY "Anyone can view site config" ON site_config
    FOR SELECT
    USING (true);

-- Política para que solo los admins puedan modificar la configuración
CREATE POLICY "Admins can modify site config" ON site_config
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Función para crear perfil de usuario automáticamente cuando se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        COALESCE(new.raw_user_meta_data->>'role', 'user')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Configuración de administración completada exitosamente!';
    RAISE NOTICE 'Tablas creadas: users, site_config';
    RAISE NOTICE 'Políticas RLS configuradas';
    RAISE NOTICE 'Triggers automáticos configurados';
END $$;
