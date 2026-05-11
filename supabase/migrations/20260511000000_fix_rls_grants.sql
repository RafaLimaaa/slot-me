-- ─── PATCH: GRANTs + WITH CHECK explícito em todas as políticas de dono ───────
--
-- Problema: políticas FOR ALL USING sem WITH CHECK bloqueiam INSERT no Supabase.
-- Solução: recriar cada política com WITH CHECK explícito e garantir GRANTs.

-- ─── GRANTs — role authenticated (donos logados) ─────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.businesses            TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.professionals         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.services              TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.professional_services TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.working_hours         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.blocked_periods       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.appointments          TO authenticated;

-- ─── GRANTs — role anon (clientes sem conta) ─────────────────────────────────
GRANT SELECT          ON TABLE public.businesses            TO anon;
GRANT SELECT          ON TABLE public.professionals         TO anon;
GRANT SELECT          ON TABLE public.services              TO anon;
GRANT SELECT          ON TABLE public.professional_services TO anon;
GRANT SELECT          ON TABLE public.working_hours         TO anon;
GRANT SELECT          ON TABLE public.blocked_periods       TO anon;
GRANT SELECT, INSERT  ON TABLE public.appointments          TO anon;

-- ─── businesses ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Dono acessa seu negócio" ON businesses;
CREATE POLICY "Dono acessa seu negócio"
  ON businesses FOR ALL
  USING     (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- ─── professionals ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Dono gerencia profissionais" ON professionals;
CREATE POLICY "Dono gerencia profissionais"
  ON professionals FOR ALL
  USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- ─── services ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Dono gerencia serviços" ON services;
CREATE POLICY "Dono gerencia serviços"
  ON services FOR ALL
  USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- ─── professional_services ────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Dono gerencia vínculo prof-serviço" ON professional_services;
CREATE POLICY "Dono gerencia vínculo prof-serviço"
  ON professional_services FOR ALL
  USING (
    professional_id IN (
      SELECT p.id FROM professionals p
      JOIN businesses b ON b.id = p.business_id
      WHERE b.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    professional_id IN (
      SELECT p.id FROM professionals p
      JOIN businesses b ON b.id = p.business_id
      WHERE b.owner_id = auth.uid()
    )
  );

-- ─── working_hours ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Dono gerencia horários" ON working_hours;
CREATE POLICY "Dono gerencia horários"
  ON working_hours FOR ALL
  USING (
    professional_id IN (
      SELECT p.id FROM professionals p
      JOIN businesses b ON b.id = p.business_id
      WHERE b.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    professional_id IN (
      SELECT p.id FROM professionals p
      JOIN businesses b ON b.id = p.business_id
      WHERE b.owner_id = auth.uid()
    )
  );

-- ─── blocked_periods ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Dono gerencia bloqueios" ON blocked_periods;
CREATE POLICY "Dono gerencia bloqueios"
  ON blocked_periods FOR ALL
  USING (
    professional_id IN (
      SELECT p.id FROM professionals p
      JOIN businesses b ON b.id = p.business_id
      WHERE b.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    professional_id IN (
      SELECT p.id FROM professionals p
      JOIN businesses b ON b.id = p.business_id
      WHERE b.owner_id = auth.uid()
    )
  );

-- ─── appointments ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Dono gerencia agendamentos" ON appointments;
CREATE POLICY "Dono gerencia agendamentos"
  ON appointments FOR ALL
  USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );
