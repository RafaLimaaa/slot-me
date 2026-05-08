-- ─── Tabelas ──────────────────────────────────────────────────────────────────

CREATE TABLE businesses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid REFERENCES auth.users(id) NOT NULL,
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  description text,
  address     text,
  city        text,
  phone       text,
  cover_url   text,
  logo_url    text,
  maps_embed_url text,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE professionals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  name        text NOT NULL,
  photo_url   text,
  specialty   text,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE services (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  name             text NOT NULL,
  price            decimal(10,2) NOT NULL,
  duration_minutes integer NOT NULL,
  created_at       timestamptz DEFAULT now()
);

CREATE TABLE professional_services (
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE,
  service_id      uuid REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (professional_id, service_id)
);

CREATE TABLE working_hours (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE NOT NULL,
  day_of_week     integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time      time NOT NULL,
  end_time        time NOT NULL,
  lunch_start     time,
  lunch_end       time
);

CREATE TABLE blocked_periods (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE NOT NULL,
  date            date NOT NULL,
  start_time      time NOT NULL,
  end_time        time NOT NULL,
  reason          text,
  created_at      timestamptz DEFAULT now()
);

CREATE TABLE appointments (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      uuid REFERENCES businesses(id) NOT NULL,
  professional_id  uuid REFERENCES professionals(id) NOT NULL,
  service_id       uuid REFERENCES services(id) NOT NULL,
  client_name      text NOT NULL,
  client_phone     text NOT NULL,
  client_email     text NOT NULL,
  date             date NOT NULL,
  start_time       time NOT NULL,
  end_time         time NOT NULL,
  status           text NOT NULL DEFAULT 'scheduled'
                     CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  cancel_token     uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  reschedule_token uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  created_at       timestamptz DEFAULT now()
);

-- ─── Índices ──────────────────────────────────────────────────────────────────

CREATE INDEX idx_businesses_owner      ON businesses(owner_id);
CREATE INDEX idx_professionals_business ON professionals(business_id);
CREATE INDEX idx_services_business     ON services(business_id);
CREATE INDEX idx_working_hours_prof    ON working_hours(professional_id);
CREATE INDEX idx_blocked_periods_prof  ON blocked_periods(professional_id, date);
CREATE INDEX idx_appointments_business ON appointments(business_id, date);
CREATE INDEX idx_appointments_prof     ON appointments(professional_id, date);
CREATE INDEX idx_appointments_cancel   ON appointments(cancel_token);
CREATE INDEX idx_appointments_reschedule ON appointments(reschedule_token);

-- ─── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE businesses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals     ENABLE ROW LEVEL SECURITY;
ALTER TABLE services          ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours     ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_periods   ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments      ENABLE ROW LEVEL SECURITY;

-- businesses
CREATE POLICY "Dono acessa seu negócio"
  ON businesses FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Público lê negócio pelo slug"
  ON businesses FOR SELECT
  USING (true);

-- professionals
CREATE POLICY "Dono gerencia profissionais"
  ON professionals FOR ALL
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Público lê profissionais"
  ON professionals FOR SELECT
  USING (true);

-- services
CREATE POLICY "Dono gerencia serviços"
  ON services FOR ALL
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Público lê serviços"
  ON services FOR SELECT
  USING (true);

-- professional_services
CREATE POLICY "Dono gerencia vínculo prof-serviço"
  ON professional_services FOR ALL
  USING (
    professional_id IN (
      SELECT p.id FROM professionals p
      JOIN businesses b ON b.id = p.business_id
      WHERE b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Público lê vínculo prof-serviço"
  ON professional_services FOR SELECT
  USING (true);

-- working_hours
CREATE POLICY "Dono gerencia horários"
  ON working_hours FOR ALL
  USING (
    professional_id IN (
      SELECT p.id FROM professionals p
      JOIN businesses b ON b.id = p.business_id
      WHERE b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Público lê horários"
  ON working_hours FOR SELECT
  USING (true);

-- blocked_periods
CREATE POLICY "Dono gerencia bloqueios"
  ON blocked_periods FOR ALL
  USING (
    professional_id IN (
      SELECT p.id FROM professionals p
      JOIN businesses b ON b.id = p.business_id
      WHERE b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Público lê bloqueios"
  ON blocked_periods FOR SELECT
  USING (true);

-- appointments
CREATE POLICY "Público insere agendamento"
  ON appointments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Público lê agendamento pelo token"
  ON appointments FOR SELECT
  USING (true);

CREATE POLICY "Dono gerencia agendamentos"
  ON appointments FOR ALL
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );
