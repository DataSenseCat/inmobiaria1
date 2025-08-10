-- Inmobiliaria Catamarca - Configuración de Base de Datos
-- Ejecutar este script completo en Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types/enums
CREATE TYPE operation AS ENUM ('venta', 'alquiler');
CREATE TYPE ptype AS ENUM ('casa', 'departamento', 'ph', 'lote', 'local');
CREATE TYPE role AS ENUM ('admin', 'agent', 'user');

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
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_operation ON properties(operation);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price_usd ON properties(price_usd);
CREATE INDEX idx_properties_featured ON properties(featured);

-- Enable RLS (Row Level Security)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Anyone can view images" ON images FOR SELECT USING (true);
CREATE POLICY "Anyone can view agents" ON agents FOR SELECT USING (true);
CREATE POLICY "Anyone can create leads" ON leads FOR INSERT WITH CHECK (true);

-- Insert sample agents
INSERT INTO agents (id, name, phone, email) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'María González', '+54 383 4567890', 'maria.gonzalez@inmobiliaria.com'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Carlos Rodríguez', '+54 383 4567891', 'carlos.rodriguez@inmobiliaria.com');

-- Insert sample properties in Catamarca
INSERT INTO properties (id, title, operation, type, price_usd, price_ars, address, city, province, rooms, bathrooms, area_covered, area_total, description, featured, agent_id) VALUES 
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
    '550e8400-e29b-41d4-a716-446655440001'
);

-- Insert sample images
INSERT INTO images (property_id, url, alt) VALUES 
('550e8400-e29b-41d4-a716-446655440101', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'Frente de la casa'),
('550e8400-e29b-41d4-a716-446655440101', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800', 'Living comedor'),
('550e8400-e29b-41d4-a716-446655440102', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'Vista del departamento'),
('550e8400-e29b-41d4-a716-446655440103', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', 'Exterior del PH'),
('550e8400-e29b-41d4-a716-446655440104', 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800', 'Vista del lote'),
('550e8400-e29b-41d4-a716-446655440105', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', 'Interior del local');

-- Success message
SELECT 'Base de datos configurada exitosamente! ✅' as resultado;
SELECT 'Total propiedades creadas: ' || COUNT(*) as propiedades FROM properties;
SELECT 'Total agentes creados: ' || COUNT(*) as agentes FROM agents;
