-- Create RSVPs table
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

-- Add confirmed column to rsvps table
ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS confirmed BOOLEAN DEFAULT NULL;

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
    END IF;
    
    -- Also try the alternative constraint name
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'rsvps_email_unique' 
        AND table_name = 'rsvps'
    ) THEN
        ALTER TABLE rsvps DROP CONSTRAINT rsvps_email_unique;
    END IF;
END $$;

-- Create Gifts table
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

-- Create Purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY,
    gift_id UUID NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES rsvps(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'waiting_confirmation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps(attending);
CREATE INDEX IF NOT EXISTS idx_gifts_reserved ON gifts(is_reserved);
CREATE INDEX IF NOT EXISTS idx_gifts_price ON gifts(price);
CREATE INDEX IF NOT EXISTS idx_purchases_gift_id ON purchases(gift_id);
CREATE INDEX IF NOT EXISTS idx_purchases_guest_id ON purchases(guest_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);

-- Clear existing gifts and insert 10 fun gift examples in Portuguese
DELETE FROM gifts;

INSERT INTO gifts (id, name, description, price, image_url, is_reserved) VALUES
    (gen_random_uuid(), 'Batedeira KitchenAid', 'Batedeira profissional para todas as suas aventuras culinárias - perfeita para biscoitos, bolos e pães!', 299.99, '/src/assets/teg1.jpeg', false),
    (gen_random_uuid(), 'Panela Le Creuset', 'Panela de ferro fundido em cores lindas - ideal para refeições cozidas lentamente e jantares em família', 349.99, '/src/assets/teg1.jpeg', false),
    (gen_random_uuid(), 'Máquina de Café Nespresso', 'Comece seus dias da melhor forma com esta máquina automática de café e espumador de leite', 199.99, '/src/assets/teg1.jpeg', false),
    (gen_random_uuid(), 'Aspirador Dyson Sem Fio', 'Mantenha sua casa impecável com este aspirador sem fio potente', 399.99, '/src/assets/teg1.jpeg', false),
    (gen_random_uuid(), 'Panela de Pressão Instant Pot', 'Panela de pressão multifuncional 7-em-1 - a nova melhor amiga da sua cozinha', 89.99, '/src/assets/teg1.jpeg', false),
    (gen_random_uuid(), 'Liquidificador Vitamix Profissional', 'Crie smoothies, sopas e molhos com este liquidificador de nível profissional', 449.99, '/src/assets/teg1.jpeg', false),
    (gen_random_uuid(), 'Fritadeira Elétrica Deluxe', 'Culinária saudável facilitada com esta fritadeira elétrica versátil', 129.99, '/src/assets/teg1.jpeg', false),
    (gen_random_uuid(), 'Central de Casa Inteligente', 'Controle sua casa com comandos de voz - o futuro está aqui!', 179.99, '/src/assets/teg1.jpeg', false),
    (gen_random_uuid(), 'Geladeira de Vinhos', 'Mantenha seus vinhos favoritos na temperatura perfeita', 299.99, '/src/assets/teg1.jpeg', false),
    (gen_random_uuid(), 'Aspirador Robô', 'Deixe a tecnologia limpar seus pisos enquanto você relaxa', 249.99, '/src/assets/teg1.jpeg', false); 