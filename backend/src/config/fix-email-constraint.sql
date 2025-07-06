-- Fix email constraint issue in existing database
-- This script will remove the unique constraint from the email field

-- First, let's see what constraints exist
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'rsvps' AND constraint_type = 'UNIQUE';

-- Remove the unique constraint from email field
DO $$ 
BEGIN
    -- Try to drop the constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'rsvps_email_key' 
        AND table_name = 'rsvps'
    ) THEN
        ALTER TABLE rsvps DROP CONSTRAINT rsvps_email_key;
        RAISE NOTICE 'Dropped constraint rsvps_email_key';
    END IF;
    
    -- Also try the alternative constraint name
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'rsvps_email_unique' 
        AND table_name = 'rsvps'
    ) THEN
        ALTER TABLE rsvps DROP CONSTRAINT rsvps_email_unique;
        RAISE NOTICE 'Dropped constraint rsvps_email_unique';
    END IF;
    
    -- Check for any other unique constraints on email
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'rsvps' 
        AND constraint_type = 'UNIQUE'
        AND constraint_definition LIKE '%email%'
    ) THEN
        RAISE NOTICE 'Found additional unique constraint on email - manual intervention may be needed';
    END IF;
END $$;

-- Verify the constraint is removed
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'rsvps' AND constraint_type = 'UNIQUE';

-- Test inserting a guest without email
INSERT INTO rsvps (id, name, email, attending, number_of_guests, confirmed) 
VALUES (gen_random_uuid(), 'Test Guest', NULL, true, 1, NULL)
ON CONFLICT DO NOTHING;

-- Clean up test data
DELETE FROM rsvps WHERE name = 'Test Guest'; 