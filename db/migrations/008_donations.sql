ALTER TABLE registrations
  ADD COLUMN donation_amount_cents integer NOT NULL DEFAULT 0
    CHECK (donation_amount_cents >= 0);
