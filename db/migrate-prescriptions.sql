-- Migration script to update existing Prescriptions table
-- Run this if you have an existing database with the old schema

-- First, check if the new columns exist
DO $$
BEGIN
    -- Add frequency column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prescriptions' AND column_name = 'frequency') THEN
        ALTER TABLE Prescriptions ADD COLUMN frequency VARCHAR(50);
        UPDATE Prescriptions SET frequency = 'Once daily' WHERE frequency IS NULL;
        ALTER TABLE Prescriptions ALTER COLUMN frequency SET NOT NULL;
    END IF;

    -- Add instructions column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prescriptions' AND column_name = 'instructions') THEN
        ALTER TABLE Prescriptions ADD COLUMN instructions TEXT;
    END IF;

    -- Add refills column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prescriptions' AND column_name = 'refills') THEN
        ALTER TABLE Prescriptions ADD COLUMN refills INT DEFAULT 0;
    END IF;
END $$;

-- Update existing records to have default values
UPDATE Prescriptions SET frequency = 'Once daily' WHERE frequency IS NULL;
UPDATE Prescriptions SET refills = 0 WHERE refills IS NULL;

-- Make frequency NOT NULL after setting default values
ALTER TABLE Prescriptions ALTER COLUMN frequency SET NOT NULL;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_prescriptions_record ON Prescriptions(record_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_medication ON Prescriptions(medication);

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'prescriptions' 
ORDER BY ordinal_position;
