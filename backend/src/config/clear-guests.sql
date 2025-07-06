-- Clear all existing guests from the database
-- This will remove all test/sample data so you can add the official guest list

DELETE FROM rsvps;

-- Reset the sequence if you're using auto-increment (though we're using UUIDs)
-- ALTER SEQUENCE rsvps_id_seq RESTART WITH 1;

-- Verify the table is empty
SELECT COUNT(*) as remaining_guests FROM rsvps; 