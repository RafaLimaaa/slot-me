# STATUS.md — SlotMe

> Análise completa do repositório em 13/05/2026.
> Nenhum arquivo de código foi alterado.

---

## SISTEMA DE DESIGN

### Duas identidades visuais (corretas por design)

| Contexto | Bg principal | Superfície | Borda | Acento |
|---|---|---|---|---|
| Landing / Público / Booking | `#F5F0E8` ou `#f8fafc` | `#FFFFFF` | `#e2e8f0` | `#C2410C` |
| Dashboard (owner) | `#0C0C0C` | `#161616` | `#2A2A2A` | `#C2410C` |

**Fonte:** Inter (Google Fonts via `next/font`) — única família usada. Sem extensão de fontes no `tailwind.config.ts`.

**Tailwind:** configuração mínima — sem tokens customizados. Todas as cores são via classes arbitrárias (`text-[#C2410C]`) ou `style={}` inline. Isso é coerente mas torna refactors de cor mais trabalhosos.

**Status colors (agenda/lista):**
- scheduled → `#1a2744` / `#3B82F6` (azul)
- completed → `#142a1e` / `#22C55E` (verde)
- cancelled → `#2a1414` / `#EF4444` (vermelho)
- no_show → `#2a1f00` / `#F59E0B` (âmbar)

### Inconsistências identificadas

**Crítica — tokens errados nos componentes de configurações:**
Os componentes internos das seções de configuração (`WorkingHoursSection`, `BlockedPeriodsSection`, `ProfessionalsSection`) usam um conjunto de tokens diferente do sistema do dashboard:

| Componente | Token usado | Token correto |
|---|---|---|
| WorkingHoursSection | `bg-[#18181b] border-[#27272a]` | `bg-[#161616] border-[#2A2A2A]` |
| BlockedPeriodsSection | `bg-[#18181b] border-[#27272a]` | `bg-[#161616] border-[#2A2A2A]` |
| ProfessionalsSection | `bg-[#18181b] border-[#27272a]` | `bg-[#161616] border-[#2A2A2A]` |
| Inputs nessas seções | `bg-[#09090b]` (bg do body) | `bg-[#0C0C0C]` ou `#1E1E1E` |

Resultado visual: esses componentes ficam ligeiramente mais escuros que o restante do dashboard, quebrando a uniformidade percebida dentro dos SectionCards.

**Menor — títulos duplicados:**
`WorkingHoursSection` e `BlockedPeriodsSection` têm `<h2>` próprio embutido ("Bloquear horário", "Horários de funcionamento") que se repete com o título do `SectionCard` pai. Causa redundância visual.

**Menor — Button secondary no dashboard:**
O componente `Button` variant `secondary` usa `dark:bg-[#27272a]` e `dark:text-[#fafafa]`. O dashboard não aplica a classe `dark` no `<html>`, mas se o browser do usuário estiver em dark mode, esses estilos podem triggar inesperadamente.

---

## PÁGINAS — ESTADO ATUAL

### `/` — Landing

**Implementado e funcionando:**
- Header com blur/beige on scroll, menu mobile com drawer
- Hero com AnimatedCalendarCard, CTA duplo (botão + "Ver como funciona")
- HowItWorks, Features, ForWho, CTA, Footer
- Animações FadeIn com stagger via IntersectionObserver

**Visualmente:** coerente com o tema beige. Sem bugs visuais no código.

**Nota:** Links "Termos de uso" e "Política de privacidade" na página de login são `<span>` sem href — não funcionais (meramente visuais).

---

### `/auth/login` — Login

**Implementado e funcionando:**
- Split screen (60% dark / 40% beige)
- Botão Google com hover via `btnHovered` state (sem flicker de gradiente)
- Spinner de loading durante autenticação
- Animação de mount com `requestAnimationFrame`

**Sem bugs visuais.**

---

### `/dashboard/onboarding` — Onboarding

**Implementado e funcionando:**
- 4 passos: Dados do negócio → Horários → Serviços → Profissionais
- Salva tudo em sequência ao final (passo 4)
- Redirect para `/dashboard` ao concluir
- Verificação: se já tem negócio, redireciona direto para `/dashboard`

**Problemas:**
- Horários definidos no passo 2 são aplicados **uniformemente a todos os profissionais** cadastrados no passo 4. Não há personalização de horário por profissional no onboarding. Isso pode gerar dados incorretos se profissionais têm horários diferentes.
- Sem rollback transacional: se o insert de profissionais falha após serviços já salvos, o banco fica em estado parcialmente inconsistente. O erro é exibido mas os serviços já foram persistidos.
- Visualmente usa tema claro (`#f8fafc` / `bg-white`) — correto para onboarding pré-dashboard.

---

### `/dashboard` — Painel principal

**Implementado e funcionando:**
- MetricsBar: 4 cards (agendamentos hoje, receita, ocupação semanal, próximo)
- AppointmentChart: bar chart recharts dos últimos 7 dias
- AppointmentList: agendamentos de hoje com ações inline (concluir, cancelar, no-show)
- DashboardSidebar: QR code, link público (com copy), próximos 5 agendamentos agrupados, ações rápidas
- EmptyState com checklist de primeiros passos
- Background grid pattern terracota + glow radial sobre métricas

**Problemas menores:**
- O background grid está no `<div>` raiz da página, sem `min-h-screen`. Em dias sem agendamentos e checklist completo, a área coberta pelo grid pode ser pequena.
- `AppointmentList` mostra mensagem "Nenhum agendamento para hoje" mesmo quando EmptyState está visível logo abaixo — duplo feedback vazio (a condição `todayAppts.length === 0` renderiza ambos).

---

### `/dashboard/agenda` — Agenda semanal

**Implementado e funcionando:**
- WeeklyCalendar: grade horária 7h–21h, HOUR_HEIGHT=96px (48px/30min)
- Navegação semanal por offset
- Filtro por profissional com chips e avatar
- Linha "agora" atualizada a cada 60s
- Blocos de agendamento com hierarquia de conteúdo (hora / nome / serviço / profissional)
- Modal de detalhes com dados completos e ações (concluir / cancelar)
- Background grid terracota
- Legenda de status

**Problemas:**
- **Modal do WeeklyCalendar não tem botão "Não compareceu"** — o `AppointmentItem` da lista do dashboard tem esse botão, mas o modal da agenda não. Inconsistência funcional entre as duas interfaces de gestão de agendamentos.
- **Bloqueios de horário não aparecem visualmente na agenda** — a `WeeklyCalendar` renderiza apenas `appointments`, não `blockedPeriods`. O owner bloqueou o horário nas configurações mas não consegue ver o bloqueio na grade da agenda.

---

### `/dashboard/configuracoes` — Configurações

**Implementado e funcionando:**
- 6 seções em SectionCard: Fotos, Dados do negócio, Horários, Serviços, Profissionais, Bloqueios
- Badges "Completo"/"Pendente" corretos em cada seção
- Upload de foto de capa e logo para o negócio (Supabase Storage)
- Upload de foto de perfil para profissionais (ProfAvatar)
- Edição completa de dados do negócio, serviços, profissionais
- CRUD completo de bloqueios de horário
- WorkingHours: salva por profissional com delete + re-insert

**Problemas visuais (já documentados em "Inconsistências"):**
- Tokens de cor errados: `#18181b`/`#27272a` em vez de `#161616`/`#2A2A2A`
- `<h2>` duplicado dentro dos SectionCards

**Problema de UX:**
- `WorkingHoursSection` exige selecionar um profissional antes de exibir os horários — se não há profissionais, a seção fica em branco com apenas o select vazio, sem mensagem orientando o usuário.

---

### `/[slug]` — Página pública do negócio

**Implementado e funcionando:**
- Server Component com `generateMetadata` (Open Graph + Twitter Card)
- BusinessHeader: capa, logo, nome, descrição, endereço, telefone
- ServiceList + ProfessionalList
- MapEmbed condicional
- CTA fixo mobile + CTA desktop
- Estado "Em breve" quando sem serviços/profissionais

**Sem bugs.**

---

### `/[slug]/agendar` — Booking flow

**Implementado e funcionando:**
- 4 passos: Serviço → Profissional → Data/Horário → Confirmação
- Filtro de profissionais por serviço selecionado
- Calendário com disponibilidade real via `getAvailableSlots`
- Validação de formulário com erros inline (nome, telefone com máscara, email)
- Insert no banco + envio de emails (confirmação cliente + notificação owner)
- Redirect para página de sucesso com Google Calendar link

**Problemas:**
- Se o insert no banco falha (`error || !data`), `setSaving(false)` é chamado mas **nenhuma mensagem de erro é exibida ao usuário** — a tela simplesmente volta ao estado normal sem feedback.
- O botão "Próximo" aparece duplicado (inline e no mobile fixed bottom) nos passos 0–2 — isso é intencional por design responsivo, mas pode confundir em telas intermediárias.

---

### `/[slug]/agendar/sucesso` — Sucesso

**Implementado e funcionando:**
- Resumo do agendamento
- Botão Google Calendar com link pré-preenchido
- Link de cancelamento
- Feedback de erro de email (amarelo) quando email falhou

---

### `/cancelar/[token]` — Cancelamento pelo cliente

**Implementado e funcionando:**
- Verificação do token (agendamento existente / já cancelado)
- Confirmação antes de cancelar
- Notificação ao owner + cliente por email
- Feedback de sucesso/erro

---

### `/reagendar/[token]` — Reagendamento

**Não implementado:** a rota existe (`src/app/reagendar/[token]/page.tsx`) mas é apenas um redirect para a landing ou retorna algo mínimo. Sem funcionalidade real de reagendamento.

---

## FUNCIONALIDADES

### Implementadas e funcionando

- Google OAuth via Supabase Auth
- Proteção de rotas via middleware (sem redirect em componente)
- Onboarding completo de 4 passos
- Dashboard com métricas, gráfico, lista de hoje, sidebar
- Agenda semanal com filtro, grade horária, ações de status
- Configurações: dados, horários, serviços, profissionais, bloqueios, uploads
- Disponibilidade real via `getAvailableSlots` (puro, sem side effects)
- Booking flow completo (4 passos)
- Emails transacionais: confirmação, cancelamento owner, cancelamento cliente (via Resend)
- Link de cancelamento por token único
- QR code público no dashboard
- signOut com redirect para login
- Upload de imagens (capa, logo, foto de profissional)
- Open Graph / Twitter Card na página pública

### Quebradas ou incompletas

| # | Problema | Impacto |
|---|---|---|
| 1 | **Reagendar sem funcionalidade real** — `/reagendar/[token]` não faz nada útil | Alto — link enviado no email vai para página morta |
| 2 | **Bloqueios invisíveis na agenda** — `WeeklyCalendar` não renderiza `blockedPeriods` | Alto — owner bloqueia horário mas não vê na grade |
| 3 | **Sem "Não compareceu" no modal da agenda** — só existe no `AppointmentItem` da lista | Médio |
| 4 | **Sem feedback de erro no booking** — falha silenciosa se insert no banco falha | Médio |
| 5 | **Horários no onboarding uniformes** — mesmo horário para todos os profissionais | Médio |
| 6 | **Tokens de cor errados nas configurações** — inconsistência visual clara | Baixo |
| 7 | **Títulos duplicados nos SectionCards** — `<h2>` interno repete o título do card pai | Baixo |
| 8 | **Termos/Privacidade sem página** — links são spans decorativos | Baixo |

---

## PENDÊNCIAS CONHECIDAS

### Botão Sair (signOut)
**Status: IMPLEMENTADO e funcionando.**
`DashboardNav` tem `handleSignOut` que faz `await signOut()` seguido de `router.push("/auth/login")`. Não há problema aqui.

### Modal de detalhes do agendamento sem dados
**Status: RESOLVIDO.** O modal em `WeeklyCalendar` exibe: cliente, telefone, email, serviço, profissional, data e horário. Os dados chegam via `AppointmentWithDetails` que já traz os joins.

**Lacuna real:** o modal **não tem** o botão "Não compareceu" — este existe apenas no `AppointmentItem` da lista do dashboard.

### Outras pendências identificadas nesta análise

1. **Reagendar** — funcionalidade ausente
2. **Bloqueios na agenda** — visibilidade ausente
3. **Erro silencioso no booking** — sem mensagem ao usuário
4. **Horários no onboarding** — aplicados uniformemente (pode gerar dados incorretos)
5. **WorkingHoursSection sem orientação** — estado vazio sem mensagem quando sem profissionais
6. **AppointmentList + EmptyState duplo** — "Nenhum agendamento" aparece mesmo com EmptyState visível

---

## PRÓXIMOS PASSOS SUGERIDOS

Ordenados por impacto × esforço:

### Alta prioridade
1. **Corrigir tokens de cor** em `WorkingHoursSection`, `BlockedPeriodsSection`, `ProfessionalsSection` — `#18181b`→`#161616`, `#27272a`→`#2A2A2A`. Mudança cirúrgica, alto ganho visual.
2. **Adicionar "Não compareceu" no modal do WeeklyCalendar** — paridade funcional com `AppointmentItem`.
3. **Mostrar bloqueios de horário na agenda semanal** — passar `blockedPeriods` para `WeeklyCalendar` e renderizá-los na grade (bloco cinza/padrão diferente).
4. **Feedback de erro no booking flow** — exibir mensagem se o insert falhar no `handleConfirm`.

### Média prioridade
5. **Implementar reagendamento** (`/reagendar/[token]`) — fluxo similar ao cancelamento: verificar token, mostrar detalhes, redirecionar para booking flow pré-preenchido.
6. **Remover títulos duplicados** dos componentes internos de configuração (os `<h2>` dentro de `WorkingHoursSection` e `BlockedPeriodsSection`).
7. **Corrigir EmptyState duplo** no dashboard — ou suprimir a mensagem "Nenhum agendamento" do `AppointmentList` quando EmptyState está presente, ou unificar.
8. **WorkingHoursSection sem profissionais** — adicionar mensagem "Cadastre um profissional primeiro" quando `professionals.length === 0`.

### Baixa prioridade / opcional
9. **Páginas de Termos de uso e Política de privacidade** — criar rotas simples.
10. **Rollback no onboarding** — se inserção parcial falhar, limpar os registros já salvos.
11. **Horários individuais por profissional no onboarding** — atualmente todos recebem o mesmo horário do passo 2.
12. **Tokens de cor no `tailwind.config.ts`** — centralizar `#C2410C`, `#161616`, etc. como tokens nomeados para facilitar manutenção futura.
