-- Database Setup Script for Wedding App
-- Run this script as a PostgreSQL superuser (usually 'postgres')

-- Create the database if it doesn't exist
-- Note: This needs to be run as a superuser
CREATE DATABASE wedding_db;

-- Connect to the new database
\c wedding_db;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    attending BOOLEAN NOT NULL,
    number_of_guests INTEGER NOT NULL,
    dietary_restrictions TEXT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add confirmed column to rsvps table
ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS confirmed BOOLEAN DEFAULT NULL;

-- Create Gifts table
CREATE TABLE IF NOT EXISTS gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_reserved BOOLEAN DEFAULT FALSE,
    reserved_by VARCHAR(255),
    reserved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps(attending);
CREATE INDEX IF NOT EXISTS idx_gifts_reserved ON gifts(is_reserved);
CREATE INDEX IF NOT EXISTS idx_gifts_price ON gifts(price);

-- Insert sample guests for testing
INSERT INTO rsvps (id, name, email, attending, number_of_guests, confirmed) VALUES
    (uuid_generate_v4(), 'marlene inacio de souza silva', 'marlene.silva@example.com', false, 1, NULL),
    (uuid_generate_v4(), 'joão da silva', 'joao.silva@example.com', false, 1, NULL),
    (uuid_generate_v4(), 'maria santos', 'maria.santos@example.com', false, 2, NULL),
    (uuid_generate_v4(), 'pedro oliveira', 'pedro.oliveira@example.com', false, 1, NULL),
    (uuid_generate_v4(), 'ana costa', 'ana.costa@example.com', false, 3, NULL)
ON CONFLICT (email) DO NOTHING;

-- Clear existing gifts and insert sample gifts
DELETE FROM gifts;

INSERT INTO gifts (id, name, description, price, image_url, is_reserved) VALUES
    (uuid_generate_v4(), 'Batedeira KitchenAid', 'Batedeira profissional para todas as suas aventuras culinárias - perfeita para biscoitos, bolos e pães!', 299.99, '/src/assets/teg1.jpeg', false),
    (uuid_generate_v4(), 'Panela Le Creuset', 'Panela de ferro fundido em cores lindas - ideal para refeições cozidas lentamente e jantares em família', 349.99, '/src/assets/teg1.jpeg', false),
    (uuid_generate_v4(), 'Máquina de Café Nespresso', 'Comece seus dias da melhor forma com esta máquina automática de café e espumador de leite', 199.99, '/src/assets/teg1.jpeg', false),
    (uuid_generate_v4(), 'Aspirador Dyson Sem Fio', 'Mantenha sua casa impecável com este aspirador sem fio potente', 399.99, '/src/assets/teg1.jpeg', false),
    (uuid_generate_v4(), 'Panela de Pressão Instant Pot', 'Panela de pressão multifuncional 7-em-1 - a nova melhor amiga da sua cozinha', 89.99, '/src/assets/teg1.jpeg', false),
    (uuid_generate_v4(), 'Liquidificador Vitamix Profissional', 'Crie smoothies, sopas e molhos com este liquidificador de nível profissional', 449.99, '/src/assets/teg1.jpeg', false),
    (uuid_generate_v4(), 'Fritadeira Elétrica Deluxe', 'Culinária saudável facilitada com esta fritadeira elétrica versátil', 129.99, '/src/assets/teg1.jpeg', false),
    (uuid_generate_v4(), 'Central de Casa Inteligente', 'Controle sua casa com comandos de voz - o futuro está aqui!', 179.99, '/src/assets/teg1.jpeg', false),
    (uuid_generate_v4(), 'Geladeira de Vinhos', 'Mantenha seus vinhos favoritos na temperatura perfeita', 299.99, '/src/assets/teg1.jpeg', false),
    (uuid_generate_v4(), 'Aspirador Robô', 'Deixe a tecnologia limpar seus pisos enquanto você relaxa', 249.99, '/src/assets/teg1.jpeg', false);

-- Grant permissions to the application user
-- Replace 'your_app_user' with your actual database user
-- GRANT ALL PRIVILEGES ON DATABASE wedding_db TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Verify the setup
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as total_guests FROM rsvps;
SELECT COUNT(*) as total_gifts FROM gifts; 