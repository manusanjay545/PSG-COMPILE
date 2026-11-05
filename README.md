# PSGCompile

> **Code. Compete. Climb.**  
> *One PSG. One Coding Community.*

A modern, production-ready, institution-wide competitive programming and online judge platform built for the **PSG educational ecosystem**.

PSGCompile unifies students and faculty across all PSG institutions, colleges, schools, departments, and academic levels into a single competitive coding community.

---

## 🏛️ Supported PSG Institutions

PSGCompile is architected with a dynamic, non-hardcoded organization hierarchy that supports any institution, college, department, program, batch, and section:

1. **PSG College of Technology** (B.E., B.Tech, M.E., M.Tech)
2. **PSG Polytechnic College** (Diploma in Computer, EC, Mechanical)
3. **PSG College of Arts & Science** (B.Sc CS, BCA, MCA, B.Sc IT)
4. **PSG Institute of Technology and Applied Research** (B.E. CSE, B.Tech IT)
5. **PSG Institute of Management** (MBA, MCA, Executive Programs)
6. *Administrators can dynamically register new PSG campuses anytime via `/admin`.*

---

## 🚀 Key Feature Matrix

| Feature | Description |
| :--- | :--- |
| **Monaco Code Editor** | High-performance editor with syntax highlighting, autocomplete, line numbers, word wrap, and themes across **C, C++, Java, Python, JavaScript, TypeScript, Go, Rust, and SQL**. |
| **Secure Code Execution** | Multi-tier sandbox runner architecture evaluating submissions against hidden and sample test suites with strict CPU, memory, and timeout constraints. |
| **One PSG Leaderboard** | Institutional leaderboard with real-time filtering by Campus, Department, Degree Program, and Graduation Batch. |
| **Live Contest Arena** | Scoped competitions (PSG-wide, Campus vs Campus, Departmental Invitationals, and Weekly Elo rounds) with live frozen scoreboards and penalty calculation. |
| **Personalized Dashboard** | Tracks problems solved (Easy/Medium/Hard), current & peak streaks, contribution heatmap, and daily recommended challenges. |
| **Institutional Identity Profile** | Rich developer profile showing Campus rank, Overall PSG rank, Department rank, Badges, and contest rating graph. |
| **Learning Roadmaps** | Structured tracks for Beginners, Core DSA, Campus Placements, and Competitive Programming. |
| **Institutional Admin Portal** | Dynamic management of Institutions, Departments, Programs, Batches, Problems, Contests, RBAC User Roles, and allowed email domains. |
| **Command Search (Ctrl+K)** | Instant global command palette for searching problems, competitors, contests, and campuses. |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router) with React 19 & TypeScript
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **UI Primitives**: Radix UI + Class Variance Authority + Sonner Toast
- **Code Editor**: `@monaco-editor/react` (Monaco Engine)
- **Database**: PostgreSQL (Supabase relational schema with UUIDs & RLS)
- **Execution Sandbox**: Isolated test runner engine with verdict generation
- **State & Theme**: `next-themes` (Dark Mode first with Light Mode support)

---

## 📦 Getting Started

### 1. Installation

```bash
cd psg
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase project URL and anon key. Authentication requires a configured Supabase project; the app does not simulate login when keys are missing:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable-your-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
EXECUTION_API_URL=http://localhost:9000
EXECUTION_API_KEY=dev-key
```

### 3. Configure Supabase Auth

In **Supabase Dashboard → Authentication → URL Configuration**, add these redirect URLs:

```text
http://localhost:3000/auth/callback
https://<your-vercel-domain>/auth/callback
```

Add your production custom domain too, if you use one. For Google sign-in, enable Google under **Authentication → Providers**, then add the Supabase callback URL shown on that provider page to the authorized redirect URIs in Google Cloud. Email/password sign-up sends a confirmation email when email confirmation is enabled. Set the Supabase site URL and email redirect allow list to your local and Vercel domains.

### 4. Database and avatar storage

For a new project, execute `supabase/schema.sql` and `supabase/seed.sql` in the Supabase SQL editor. For an existing project, execute `supabase/auth_profiles_migration.sql` instead. It adds the profile fields, profile creation trigger, row security policies, and the public `avatars` bucket used for uploaded photos.

### 5. Online compiler

The home page compiler uses Judge0 CE. Set `JUDGE0_API_URL` to your Judge0-compatible host (for example `https://ce.judge0.com`) and, when required by your host, set `JUDGE0_API_KEY` as a server-only environment variable. The language picker loads every language enabled by that runtime. Never expose the key with a `NEXT_PUBLIC_` prefix.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Deploy on Vercel

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or the legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`) to the Vercel project’s Production, Preview, and Development environments. Callback URLs are derived from the current site origin; add each deployed `/auth/callback` URL to Supabase’s redirect allow list. Never expose a Supabase service-role key as a `NEXT_PUBLIC_` variable; the auth and profile flows use the publishable key with row-level security.

### 8. Build for Production

```bash
npm run build
npm run start
```

---

## 🔐 Database Hierarchy & Schema

PSGCompile models the complete educational organization hierarchy:

```text
Institution (e.g. PSG College of Technology)
  └── Department (e.g. Information Technology)
        └── Program (e.g. B.Tech IT)
              └── Batch (e.g. 2023–2027)
                    └── Section (e.g. Section A)
                          └── Student (@manu)
```

Schema file located at: [`supabase/schema.sql`](supabase/schema.sql)  
Realistic seed dataset located at: [`supabase/seed.sql`](supabase/seed.sql)

---

## 🛡️ Online Judge Verdicts

- **Accepted (`accepted`)**: Code passed all sample and hidden test cases within limits.
- **Wrong Answer (`wrong_answer`)**: Output does not match expected testcase output.
- **Time Limit Exceeded (`time_limit_exceeded`)**: Code exceeded CPU time limit (2000ms).
- **Memory Limit Exceeded (`memory_limit_exceeded`)**: Code exceeded memory allocation (256MB).
- **Runtime Error (`runtime_error`)**: Unhandled exception or restricted system call.
- **Compilation Error (`compilation_error`)**: Syntax error or compilation failure.

---

## 📜 License

Created for the PSG Educational Community. © 2026 PSGCompile.

