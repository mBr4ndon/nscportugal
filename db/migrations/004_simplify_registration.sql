ALTER TABLE registrations
  DROP COLUMN IF EXISTS address,
  DROP COLUMN IF EXISTS postal_code,
  DROP COLUMN IF EXISTS city,
  DROP COLUMN IF EXISTS emergency_contact_name,
  DROP COLUMN IF EXISTS emergency_contact_phone,
  DROP COLUMN IF EXISTS affiliation_type;
