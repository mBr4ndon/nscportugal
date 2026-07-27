ALTER TABLE registrations
  ADD COLUMN ticket_token uuid NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE registrations
  ADD CONSTRAINT registrations_ticket_token_unique UNIQUE (ticket_token);
