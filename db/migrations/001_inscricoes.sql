CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_code varchar(20) NOT NULL UNIQUE,
  ticket_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  status varchar(30) NOT NULL CHECK (status IN ('pending_payment', 'confirmed', 'cancelled', 'expired')),
  life_state varchar(20) NOT NULL CHECK (life_state IN ('leigo', 'sacerdote', 'religioso')),
  registration_type varchar(20) NOT NULL CHECK (registration_type IN ('individual', 'familia')),
  route varchar(20) NOT NULL CHECK (route IN ('adultos', 'familias')),
  contact_email text NOT NULL,
  contact_phone varchar(30) NOT NULL,
  affiliation_name varchar(200),
  family_cap_type varchar(20) CHECK (family_cap_type IN ('nacional', 'internacional')),
  subtotal_amount_cents integer NOT NULL CHECK (subtotal_amount_cents >= 0),
  family_discount_cents integer NOT NULL DEFAULT 0 CHECK (family_discount_cents >= 0),
  base_amount_cents integer NOT NULL CHECK (base_amount_cents >= 0),
  extras_amount_cents integer NOT NULL CHECK (extras_amount_cents >= 0),
  total_amount_cents integer NOT NULL CHECK (total_amount_cents >= 0),
  pricing_version integer NOT NULL DEFAULT 1,
  locale varchar(10) NOT NULL DEFAULT 'pt',
  terms_accepted_at timestamptz NOT NULL,
  privacy_accepted_at timestamptz NOT NULL,
  image_authorized boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz
);

CREATE UNIQUE INDEX registrations_active_email_unique
  ON registrations (lower(contact_email))
  WHERE status IN ('pending_payment', 'confirmed');
CREATE INDEX registrations_status_idx ON registrations (status);
CREATE INDEX registrations_created_at_idx ON registrations (created_at DESC);

CREATE TABLE participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  role varchar(20) NOT NULL CHECK (role IN ('primary', 'family_member')),
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  birth_date date NOT NULL,
  age_at_registration integer NOT NULL CHECK (age_at_registration >= 0),
  nationality_code char(2) NOT NULL,
  individual_price_cents integer NOT NULL CHECK (individual_price_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX participants_one_primary
  ON participants (registration_id)
  WHERE role = 'primary';

CREATE TABLE registration_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  service_code varchar(30) NOT NULL CHECK (service_code IN ('dormida_nazare', 'dormida_fatima', 'transporte_nazare')),
  status varchar(20) NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'unavailable', 'cancelled')),
  unit_amount_cents integer NOT NULL CHECK (unit_amount_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (participant_id, service_code)
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  provider varchar(30) NOT NULL,
  method varchar(30) NOT NULL CHECK (method IN ('stripe', 'manual', 'exempt')),
  status varchar(20) NOT NULL CHECK (status IN ('created', 'pending', 'paid', 'failed', 'expired', 'refunded')),
  provider_order_id varchar(255) NOT NULL UNIQUE,
  provider_transaction_id varchar(100),
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  entity varchar(20),
  reference varchar(50),
  expires_at timestamptz,
  provider_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

CREATE INDEX payments_registration_idx ON payments (registration_id);
CREATE INDEX payments_status_idx ON payments (status);
