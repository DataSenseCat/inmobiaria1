-- Create developments table and related structures
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
        -- Add foreign key constraint only if it doesn't exist
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
ON CONFLICT (id) DO NOTHING;
