CREATE TABLE discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(50) NOT NULL,
  percentage smallint NOT NULL CHECK (percentage BETWEEN 1 AND 100),
  active boolean NOT NULL DEFAULT true,
  valid_from timestamptz,
  valid_until timestamptz,
  max_redemptions integer CHECK (max_redemptions IS NULL OR max_redemptions > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX discount_codes_code_unique
  ON discount_codes (upper(code));

ALTER TABLE registrations
  ADD COLUMN discount_code_id uuid REFERENCES discount_codes(id),
  ADD COLUMN promo_discount_cents integer NOT NULL DEFAULT 0
    CHECK (promo_discount_cents >= 0);

CREATE INDEX registrations_discount_code_idx
  ON registrations (discount_code_id)
  WHERE discount_code_id IS NOT NULL;
