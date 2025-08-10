-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types/enums
CREATE TYPE operation AS ENUM ('venta', 'alquiler');
CREATE TYPE ptype AS ENUM ('casa', 'departamento', 'ph', 'lote', 'local');
CREATE TYPE role AS ENUM ('admin', 'agent', 'user');

-- Create profiles table
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role role DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create agents table
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    operation operation NOT NULL,
    type ptype NOT NULL,
    price_usd NUMERIC,
    price_ars NUMERIC,
    address TEXT,
    city TEXT,
    province TEXT,
    rooms INTEGER,
    bathrooms INTEGER,
    area_covered INTEGER,
    area_total INTEGER,
    description TEXT,
    featured BOOLEAN DEFAULT FALSE,
    coordinates GEOGRAPHY(POINT, 4326),
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create images table
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT
);

-- Create leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kind TEXT CHECK (kind IN ('contacto', 'tasacion')) NOT NULL,
    property_id UUID NULL REFERENCES properties(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE favorites (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, property_id)
);

-- Create developments table
CREATE TABLE developments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'planificacion',
    address TEXT,
    city TEXT,
    province TEXT,
    description TEXT,
    hero_url TEXT,
    amenities TEXT[],
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    coordinates GEOGRAPHY(POINT, 4326),
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_operation ON properties(operation);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price_usd ON properties(price_usd);
CREATE INDEX idx_properties_rooms ON properties(rooms);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_properties_created_at ON properties(created_at);
CREATE INDEX idx_properties_coordinates ON properties USING GIST(coordinates);
CREATE INDEX idx_images_property_id ON images(property_id);
CREATE INDEX idx_leads_property_id ON leads(property_id);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_kind ON leads(kind);
CREATE INDEX idx_leads_is_read ON leads(is_read);
CREATE INDEX idx_developments_status ON developments(status);
CREATE INDEX idx_developments_city ON developments(city);
CREATE INDEX idx_developments_created_at ON developments(created_at);
CREATE INDEX idx_developments_coordinates ON developments USING GIST(coordinates);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for properties updated_at
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for developments updated_at
CREATE TRIGGER update_developments_updated_at
    BEFORE UPDATE ON developments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, role)
    VALUES (NEW.id, 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE developments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for agents
CREATE POLICY "Anyone can view agents" ON agents
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage agents" ON agents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for properties
CREATE POLICY "Anyone can view properties" ON properties
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage all properties" ON properties
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Agents can manage own properties" ON properties
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN agents a ON a.email = (
                SELECT email FROM auth.users WHERE id = p.user_id
            )
            WHERE p.user_id = auth.uid() 
            AND p.role = 'agent' 
            AND a.id = agent_id
        )
    );

-- RLS Policies for images
CREATE POLICY "Anyone can view images" ON images
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage all images" ON images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Agents can manage images of own properties" ON images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties p
            JOIN profiles pr ON pr.user_id = auth.uid()
            JOIN agents a ON a.email = (
                SELECT email FROM auth.users WHERE id = pr.user_id
            )
            WHERE p.id = property_id 
            AND pr.role = 'agent' 
            AND a.id = p.agent_id
        )
    );

-- RLS Policies for leads
CREATE POLICY "Anyone can create leads" ON leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all leads" ON leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Agents can view leads for own properties" ON leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties p
            JOIN profiles pr ON pr.user_id = auth.uid()
            JOIN agents a ON a.email = (
                SELECT email FROM auth.users WHERE id = pr.user_id
            )
            WHERE p.id = property_id 
            AND pr.role = 'agent' 
            AND a.id = p.agent_id
        )
    );

CREATE POLICY "Admins can delete leads" ON leads
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for favorites
CREATE POLICY "Users can manage own favorites" ON favorites
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for developments
CREATE POLICY "Anyone can view developments" ON developments
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage all developments" ON developments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Agents can manage own developments" ON developments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN agents a ON a.email = (
                SELECT email FROM auth.users WHERE id = p.user_id
            )
            WHERE p.user_id = auth.uid()
            AND p.role = 'agent'
            AND a.id = agent_id
        )
    );

-- Create Storage bucket for property images
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- Storage policies
CREATE POLICY "Anyone can view property images" ON storage.objects
    FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'property-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update own property images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'property-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can delete own property images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'property-images' 
        AND auth.role() = 'authenticated'
    );

-- Insert seed data for agents
INSERT INTO agents (id, name, phone, email) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'María González', '+54 383 4567890', 'maria.gonzalez@inmobiliaria.com'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Carlos Rodríguez', '+54 383 4567891', 'carlos.rodriguez@inmobiliaria.com');

-- Insert seed data for properties (5 properties in Catamarca)
INSERT INTO properties (id, title, operation, type, price_usd, price_ars, address, city, province, rooms, bathrooms, area_covered, area_total, description, featured, coordinates, agent_id) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440101',
    'Casa en Barrio Norte - Zona Residencial',
    'venta',
    'casa',
    120000,
    36000000,
    'Av. Belgrano 1250',
    'San Fernando del Valle de Catamarca',
    'Catamarca',
    3,
    2,
    120,
    300,
    'Hermosa casa en barrio residencial, con jardín amplio, cochera para 2 autos, y todas las comodidades. Ideal para familia.',
    true,
    ST_GeogFromText('POINT(-65.7846 -28.4696)'),
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    '550e8400-e29b-41d4-a716-446655440102', 
    'Departamento Céntrico - 2 Dormitorios',
    'alquiler',
    'departamento',
    null,
    180000,
    'San Martín 456',
    'San Fernando del Valle de Catamarca',
    'Catamarca',
    2,
    1,
    65,
    65,
    'Departamento moderno en el centro de la ciudad, cerca de todos los servicios. Excelente ubicación.',
    false,
    ST_GeogFromText('POINT(-65.7887 -28.4669)'),
    '550e8400-e29b-41d4-a716-446655440002'
),
(
    '550e8400-e29b-41d4-a716-446655440103',
    'PH en Barrio Jardín - Oportunidad Única',
    'venta',
    'ph',
    85000,
    25500000,
    'Los Álamos 789',
    'San Fernando del Valle de Catamarca', 
    'Catamarca',
    2,
    1,
    80,
    120,
    'PH con patio propio, ideal para primera vivienda. Buena ubicación y precio accesible.',
    true,
    ST_GeogFromText('POINT(-65.7823 -28.4721)'),
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    '550e8400-e29b-41d4-a716-446655440104',
    'Lote en Zona Residencial - Apto Duplex',
    'venta', 
    'lote',
    45000,
    13500000,
    'Barrio Los Pinos, Manzana 15',
    'San Fernando del Valle de Catamarca',
    'Catamarca',
    null,
    null,
    null,
    400,
    'Excelente lote para construcción, con todos los servicios. Zona en desarrollo con proyección.',
    false,
    ST_GeogFromText('POINT(-65.7901 -28.4634)'),
    '550e8400-e29b-41d4-a716-446655440002'
),
(
    '550e8400-e29b-41d4-a716-446655440105',
    'Local Comercial - Zona Peatonal',
    'alquiler',
    'local',
    null,
    350000,
    'Rivadavia 234',
    'San Fernando del Valle de Catamarca',
    'Catamarca',
    null,
    1,
    45,
    45,
    'Local comercial en zona peatonal del centro. Alto tránsito de personas, ideal para cualquier rubro.',
    true,
    ST_GeogFromText('POINT(-65.7892 -28.4671)'),
    '550e8400-e29b-41d4-a716-446655440001'
);

-- Insert seed data for images
INSERT INTO images (property_id, url, alt) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'Frente de la casa'),
('550e8400-e29b-41d4-a716-446655440101', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800', 'Living comedor'),
('550e8400-e29b-41d4-a716-446655440102', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'Vista del departamento'),
('550e8400-e29b-41d4-a716-446655440103', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', 'Exterior del PH'),
('550e8400-e29b-41d4-a716-446655440104', 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800', 'Vista del lote'),
('550e8400-e29b-41d4-a716-446655440105', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', 'Interior del local');

-- Insert seed data for developments
INSERT INTO developments (id, title, status, address, city, province, description, hero_url, amenities, progress, coordinates, agent_id) VALUES
(
    '550e8400-e29b-41d4-a716-446655440201',
    'Torres del Valle - Complejo Residencial',
    'construccion',
    'Av. Libertador 2000',
    'San Fernando del Valle de Catamarca',
    'Catamarca',
    'Moderno complejo residencial con amenities de primer nivel. Departamentos de 1, 2 y 3 dormitorios con vista panorámica a las montañas.',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    ARRAY['Pileta', 'Gimnasio', 'SUM', 'Seguridad 24hs', 'Cocheras'],
    65,
    ST_GeogFromText('POINT(-65.7801 -28.4588)'),
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    '550e8400-e29b-41d4-a716-446655440202',
    'Barrio Cerrado Los Molles',
    'planificacion',
    'Ruta 33 Km 8',
    'San Fernando del Valle de Catamarca',
    'Catamarca',
    'Exclusivo barrio cerrado con lotes de 600m² a 1200m². Entorno natural privilegiado con vista a las sierras.',
    'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800',
    ARRAY['Clubhouse', 'Cancha de tenis', 'Área recreativa', 'Seguridad privada', 'Arbolado nativo'],
    15,
    ST_GeogFromText('POINT(-65.7912 -28.4234)'),
    '550e8400-e29b-41d4-a716-446655440002'
),
(
    '550e8400-e29b-41d4-a716-446655440203',
    'Centro Comercial Plaza Norte',
    'finalizado',
    'Av. Belgrano y Córdoba',
    'San Fernando del Valle de Catamarca',
    'Catamarca',
    'Moderno centro comercial con locales de diferentes tamaños. Excelente oportunidad de inversión en zona de alto tránsito.',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    ARRAY['Estacionamiento cubierto', 'Patio de comidas', 'Aire acondicionado central', 'Escaleras mecánicas'],
    100,
    ST_GeogFromText('POINT(-65.7876 -28.4695)'),
    '550e8400-e29b-41d4-a716-446655440001'
);
