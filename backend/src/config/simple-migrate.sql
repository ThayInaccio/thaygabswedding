-- Simple migration script for Render deployment
-- This script directly adds missing columns without complex functions

-- Ensure gifts table exists
CREATE TABLE IF NOT EXISTS gifts (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_reserved BOOLEAN DEFAULT FALSE,
    reserved_by VARCHAR(255),
    reserved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add pix_code column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'gifts' AND column_name = 'pix_code'
    ) THEN
        ALTER TABLE gifts ADD COLUMN pix_code TEXT;
        RAISE NOTICE 'Added pix_code column to gifts table';
    ELSE
        RAISE NOTICE 'pix_code column already exists in gifts table';
    END IF;
END $$;

-- Add status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'gifts' AND column_name = 'status'
    ) THEN
        ALTER TABLE gifts ADD COLUMN status VARCHAR(32) DEFAULT 'available';
        RAISE NOTICE 'Added status column to gifts table';
    ELSE
        RAISE NOTICE 'status column already exists in gifts table';
    END IF;
END $$;

-- Update existing records to have default status
UPDATE gifts SET status = 'available' WHERE status IS NULL;

-- Ensure RSVPs table exists
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    attending BOOLEAN NOT NULL,
    number_of_guests INTEGER NOT NULL,
    dietary_restrictions TEXT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add confirmed column to rsvps if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'rsvps' AND column_name = 'confirmed'
    ) THEN
        ALTER TABLE rsvps ADD COLUMN confirmed BOOLEAN DEFAULT NULL;
        RAISE NOTICE 'Added confirmed column to rsvps table';
    ELSE
        RAISE NOTICE 'confirmed column already exists in rsvps table';
    END IF;
END $$;

-- Ensure purchases table exists
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY,
    gift_id UUID NOT NULL,
    guest_id UUID NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'waiting_confirmation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add confirmed_at column to purchases if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'purchases' AND column_name = 'confirmed_at'
    ) THEN
        ALTER TABLE purchases ADD COLUMN confirmed_at TIMESTAMP;
        RAISE NOTICE 'Added confirmed_at column to purchases table';
    ELSE
        RAISE NOTICE 'confirmed_at column already exists in purchases table';
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps(attending);
CREATE INDEX IF NOT EXISTS idx_gifts_reserved ON gifts(is_reserved);
CREATE INDEX IF NOT EXISTS idx_gifts_price ON gifts(price);
CREATE INDEX IF NOT EXISTS idx_gifts_status ON gifts(status);
CREATE INDEX IF NOT EXISTS idx_purchases_gift_id ON purchases(gift_id);
CREATE INDEX IF NOT EXISTS idx_purchases_guest_id ON purchases(guest_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);

-- Insert sample gift if table is empty
INSERT INTO gifts (id, name, description, price, image_url, is_reserved, pix_code, status) 
SELECT 
    gen_random_uuid(), 
    'Batedeira KitchenAid', 
    'Batedeira profissional para todas as suas aventuras culinárias - perfeita para biscoitos, bolos e pães!', 
    299.99, 
    '/src/assets/teg1.jpeg', 
    false, 
    'pixcode1',
    'available'
WHERE NOT EXISTS (SELECT 1 FROM gifts LIMIT 1);

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Simple migration completed successfully at %', NOW();
END $$; 