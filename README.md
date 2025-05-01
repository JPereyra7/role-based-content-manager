# Role‑Based Content Manager

A full‑stack demo built with **Next.js (App Router)**, **Supabase** and **shadcn/ui**.  
It satisfies the work‑test brief:

* Admin / Viewer roles with Supabase Auth
* Realtime product dashboard (grid + table views)
* User management page – Admins can flip roles, Viewers read‑only
* Global sidebar navigation
* Dark‑mode UI everywhere for a consistent look‑and‑feel

---

## 🔧 Stack

| Layer | Tech |
| ----- | ---- |
| Front‑end | Next.js · TypeScript · TailwindCSS · shadcn/ui · @tanstack/react‑table |
| Back‑end | Supabase (PostgreSQL + Realtime + Auth) |
| Icons | lucide‑react |

---

## ✨ Key Features

* **Authentication & RBAC** – Supabase Auth stores `role` in **public.users**; RLS denies writes for viewers.
* **Products CRUD** – Admins can add, edit, delete.  Viewers only see details.
* **Realtime updates** – Each list subscribes to a `postgres_changes` channel.  Inserts/updates/deletes flow to the UI without refresh.
* **User management** – Admin table lists every user; one‑click toggle between *admin*⇄*viewer*.
* **Global UI shell** – Sidebar + layout wrapper; dark palette (`bg-gray-900`, `text-gray-100`).

---

## ⚔️ Conflict‑Detection Approach

Because every mutation also publishes over Supabase Realtime, the UI always
receives the **latest row state**. When an Admin opens the edit form we do not
explicitly lock the row; instead we:

1. Fetch the most recent data when the form mounts.
2. After save, the channel broadcasts an `UPDATE`; every other open view
   re‑renders with the new values.

> Assumption: simultaneous edits are rare; showing the freshest row is an
> acceptable conflict‑resolution strategy for this scope.

A more advanced version could store a `version` number or `updated_at` check and
warn if it changed during editing.

---

## 🗒️ Assumptions Made

* Only *admins* will create / edit products and manage users.
* A single Supabase project is used; schemas are kept in **public** for clarity.
* Dark‑mode is the sole theme (requirement). No light‑mode styling.
* Was initially keen to add a list of 3D‑models instead but were dropped to meet the timeframe.

---

## 🚀 Local Setup

### 1 · Clone and install

```bash
git clone <repo-url>
cd role-based-content-manager
npm install
```

### 2 · Environment variables

Create **.env.local** in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 3 · Run dev server

```bash
npm run dev
```

App runs at <http://localhost:3000>.

---

## 🌐 Deploy (Vercel)

1. Push code to GitHub.
2. Import repo in Vercel → configure environment vars as above.
3. Select **Next.js** preset → Deploy.

---

## 👤 Test Accounts

| Role  | Email / Password |
|-------|------------------|
| Admin | `admin@charpstar.com` / `Test123` |
| Viewer| `viewer@charpstar.com` / `Test123` |

Create them in Supabase Auth > Users and set `users.role` accordingly.

---

