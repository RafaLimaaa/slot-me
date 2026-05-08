# SlotMe

Sistema de agendamento online para negócios de serviços. Barbearias, salões e clínicas criam sua página em minutos — clientes agendam sem criar conta.

**Produção:** https://slotme.vercel.app

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth + RLS)
- Resend (email transacional)
- Vitest + React Testing Library

## Desenvolvimento

```bash
npm install
npm run dev        # localhost:3000
npm run test       # testes unitários
npm run build      # build de produção
npm run lint       # ESLint
```

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Banco de dados

Execute as migrations em `supabase/migrations/` no painel do Supabase ou via CLI:

```bash
supabase db push
```

---

Desenvolvido por [Rafael Lima](https://github.com/RafaLimaaa)
