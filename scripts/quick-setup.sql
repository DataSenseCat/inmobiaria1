-- Quick setup for testing - Essential tables only
-- Run this in Supabase SQL Editor if you want to test quickly

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE operation AS ENUM ('venta', 'alquiler');
CREATE TYPE ptype AS ENUM ('casa', 'departamento', 'ph', 'lote', 'local');

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

-- Insert sample agent
INSERT INTO agents (id, name, phone, email) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'María González', '+54 383 4567890', 'maria.gonzalez@inmobiliaria.com');

-- Insert sample properties
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
    'Hermosa casa en barrio residencial, con jardín amplio, cochera para 2 autos, y todas las comodidades.',
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
    'Departamento moderno en el centro de la ciudad, cerca de todos los servicios.',
    false,
    '550e8400-e29b-41d4-a716-446655440001'
);

-- Insert sample images
INSERT INTO images (property_id, url, alt) VALUES 
('550e8400-e29b-41d4-a716-446655440101', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'Frente de la casa'),
('550e8400-e29b-41d4-a716-446655440102', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'Vista del departamento');

-- Enable RLS (basic)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Create basic policies for public read access
CREATE POLICY "Anyone can view properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Anyone can view images" ON images FOR SELECT USING (true);
CREATE POLICY "Anyone can view agents" ON agents FOR SELECT USING (true);
