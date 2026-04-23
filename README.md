# Habibi API

REST API website lengkap untuk bot WhatsApp / project apapun. Mirip naze.biz.id — dengan landing page, dokumentasi, sistem login, generate API key, dashboard, dan rate limiting.

**Tech stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma · PostgreSQL · JWT auth.

## ✨ Fitur

- 🔐 **Auth lengkap** — register, login, logout (JWT cookie based)
- 🔑 **API Key system** — user bisa generate banyak key, tracking usage, rate limit per key
- 📊 **Dashboard** — lihat key, sisa quota, hapus key
- 📚 **Dokumentasi** + **Playground** untuk test endpoint langsung
- 🚀 **6 Endpoint siap pakai:**
  - `GET /api/v1/ytmp3` — YouTube ke MP3
  - `GET /api/v1/ytmp4` — YouTube ke MP4
  - `GET /api/v1/tiktok` — TikTok no watermark
  - `GET|POST /api/v1/ai` — AI Chat (GPT)
  - `GET /api/v1/anime` — Random anime image
  - `GET /api/v1/news` — Berita terkini

---

## 🚀 Cara Deploy ke Vercel + GitHub (Step by Step)

### 1. Siapkan database PostgreSQL gratis

Pilih salah satu (rekomendasi **Neon**):

- **Neon** → https://neon.tech (free 0.5 GB, gampang)
- **Supabase** → https://supabase.com (free 500 MB)
- **Vercel Postgres** → https://vercel.com/storage/postgres

Buat project, copy **connection string** (format: `postgresql://user:pass@host/db?sslmode=require`).

### 2. Push project ke GitHub

```bash
cd nextjs-app
git init
git add .
git commit -m "init: habibi api"
gh repo create habibi-api --public --source=. --push
# atau manual: buat repo di github.com lalu:
# git remote add origin https://github.com/USERNAME/habibi-api.git
# git branch -M main
# git push -u origin main
```

### 3. Deploy ke Vercel

1. Buka https://vercel.com/new
2. Import repo `habibi-api` dari GitHub
3. **Framework Preset:** Next.js (otomatis terdeteksi)
4. **Root Directory:** kalau project ada di subfolder, pilih `nextjs-app`
5. Tambahkan **Environment Variables**:

   | Key              | Value                                                            |
   | ---------------- | ---------------------------------------------------------------- |
   | `DATABASE_URL`   | connection string dari Neon/Supabase                             |
   | `JWT_SECRET`     | random string min 32 char (`openssl rand -base64 32`)            |
   | `OPENAI_API_KEY` | (optional) untuk endpoint AI — https://platform.openai.com/api-keys |

6. Klik **Deploy**

### 4. Push schema ke database

Setelah deploy pertama selesai, jalankan ini di lokal **sekali saja** (pakai `DATABASE_URL` yang sama):

```bash
cd nextjs-app
echo 'DATABASE_URL="postgresql://..."' > .env
npm install
npx prisma db push
```

Tabel `User`, `ApiKey`, `Usage` akan otomatis dibuat.

### 5. Buka website kamu

`https://habibi-api-USERNAME.vercel.app` — daftar akun → dashboard → generate API key → langsung pakai 🎉

---

## 💻 Development Lokal

```bash
cd nextjs-app
cp .env.example .env
# edit .env, isi DATABASE_URL & JWT_SECRET

npm install
npx prisma db push
npm run dev
```

Buka http://localhost:3000

---

## 📡 Contoh Pemakaian

```bash
# Random anime
curl "https://your-app.vercel.app/api/v1/anime?apikey=hit-xxxxx"

# TikTok downloader
curl "https://your-app.vercel.app/api/v1/tiktok?url=https://vt.tiktok.com/xxx&apikey=hit-xxxxx"

# AI chat
curl -X POST "https://your-app.vercel.app/api/v1/ai" \
  -H "content-type: application/json" \
  -d '{"prompt":"Halo, perkenalkan diri kamu","apikey":"hit-xxxxx"}'
```

Format response:

```json
{
  "status": true,
  "creator": "Habibi API",
  "remaining": 998,
  "result": { ... }
}
```

---

## ⚠️ Catatan Penting

- **YouTube endpoints (ytmp3/ytmp4):** YouTube sering memblokir IP datacenter. Vercel pakai datacenter, jadi kadang ytdl-core gagal. Solusi: pakai cookie YouTube atau host di VPS sendiri kalau perlu reliabilitas tinggi.
- **TikTok:** pakai API publik `tikwm.com` — gratis, no key, tapi rate-limited oleh tikwm.
- **AI:** butuh OpenAI API key kamu sendiri (model `gpt-4o-mini`, murah).
- **News:** pakai Hacker News API (tech) & Spaceflight News API (science) — keduanya gratis tanpa key.

---

## 🛠️ Customization

- **Ubah default rate limit** → edit `nextjs-app/prisma/schema.prisma`, field `limit` di model `ApiKey` (default `1000`).
- **Tambah endpoint baru** → buat file di `src/app/api/v1/<nama>/route.ts`, ikutin pola yang ada.
- **Ubah branding** → edit `src/app/page.tsx`, `src/components/Navbar.tsx`, dan warna di `tailwind.config.ts`.

---

## 📄 License

MIT — pakai bebas, ubah bebas.
