-- Safe migration script for gifts table
-- This script adds missing columns without affecting existing data

-- Function to safely add columns if they don't exist
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
    p_table_name text,
    p_column_name text,
    p_column_definition text
) RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = p_table_name 
        AND column_name = p_column_name
    ) THEN
        EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', p_table_name, p_column_name, p_column_definition);
        RAISE NOTICE 'Added column % to table %', p_column_name, p_table_name;
    ELSE
        RAISE NOTICE 'Column % already exists in table %', p_column_name, p_table_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

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

-- Add missing columns safely
SELECT add_column_if_not_exists('gifts', 'pix_code', 'TEXT');
SELECT add_column_if_not_exists('gifts', 'status', 'VARCHAR(32) DEFAULT ''available''');

-- Update existing records to have default status if status column was just added
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

-- Add missing columns to rsvps table safely
SELECT add_column_if_not_exists('rsvps', 'confirmed', 'BOOLEAN DEFAULT NULL');

-- Ensure purchases table exists
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY,
    gift_id UUID NOT NULL,
    guest_id UUID NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'waiting_confirmation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP
);

-- Add missing columns to purchases table safely
SELECT add_column_if_not_exists('purchases', 'confirmed_at', 'TIMESTAMP');

-- Add foreign key constraints if they don't exist
DO $$ 
BEGIN
    -- Add foreign key for purchases.gift_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'purchases_gift_id_fkey' 
        AND table_name = 'purchases'
    ) THEN
        ALTER TABLE purchases ADD CONSTRAINT purchases_gift_id_fkey 
        FOREIGN KEY (gift_id) REFERENCES gifts(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added foreign key constraint purchases_gift_id_fkey';
    END IF;
    
    -- Add foreign key for purchases.guest_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'purchases_guest_id_fkey' 
        AND table_name = 'purchases'
    ) THEN
        ALTER TABLE purchases ADD CONSTRAINT purchases_guest_id_fkey 
        FOREIGN KEY (guest_id) REFERENCES rsvps(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added foreign key constraint purchases_guest_id_fkey';
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

-- Remove unique constraint from email if it exists (multiple ways to ensure it's removed)
DO $$ 
BEGIN
    -- Try to drop the constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'rsvps_email_key' 
        AND table_name = 'rsvps'
    ) THEN
        ALTER TABLE rsvps DROP CONSTRAINT rsvps_email_key;
        RAISE NOTICE 'Removed unique constraint rsvps_email_key';
    END IF;
    
    -- Also try the alternative constraint name
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'rsvps_email_unique' 
        AND table_name = 'rsvps'
    ) THEN
        ALTER TABLE rsvps DROP CONSTRAINT rsvps_email_unique;
        RAISE NOTICE 'Removed unique constraint rsvps_email_unique';
    END IF;
END $$;

-- Insert sample gifts if table is empty
INSERT INTO gifts (id, name, description, price, image_url, is_reserved, pix_code) 
SELECT 
    gen_random_uuid(), 
    'Batedeira KitchenAid', 
    'Batedeira profissional para todas as suas aventuras culinárias - perfeita para biscoitos, bolos e pães!', 
    299.99, 
    '/src/assets/teg1.jpeg', 
    false, 
    'pixcode1'
WHERE NOT EXISTS (SELECT 1 FROM gifts LIMIT 1);

-- Clean up the helper function
DROP FUNCTION IF EXISTS add_column_if_not_exists(text, text, text);

-- Log migration completion
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully at %', NOW();
END $$; 