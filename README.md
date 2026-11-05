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

Fill in your Supabase project credentials (the platform functions seamlessly in demo/dev mode even without external keys):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
EXECUTION_API_URL=http://localhost:9000
EXECUTION_API_KEY=dev-key
```

### 3. Database Migration

Execute `supabase/schema.sql` and `supabase/seed.sql` in your Supabase SQL editor or local PostgreSQL instance.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

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
