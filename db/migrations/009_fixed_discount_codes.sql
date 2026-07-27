ALTER TABLE discount_codes
  ADD COLUMN discount_type varchar(20) NOT NULL DEFAULT 'percentage',
  ADD COLUMN fixed_amount_cents integer;

ALTER TABLE discount_codes
  ALTER COLUMN percentage DROP NOT NULL;

ALTER TABLE discount_codes
  ADD CONSTRAINT discount_codes_value_check CHECK (
    (
      discount_type = 'percentage'
      AND percentage BETWEEN 1 AND 100
      AND fixed_amount_cents IS NULL
    )
    OR
    (
      discount_type = 'fixed'
      AND percentage IS NULL
      AND fixed_amount_cents BETWEEN 1 AND 1000000
    )
  );
