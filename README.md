# Habibi API

REST API Service by **Habibi Official**.

## Local Development

```bash
npm install
npm start
```

Server jalan di `http://localhost:5000`.

## Cara Deploy ke Vercel via GitHub

### 1. Upload ke GitHub
1. Buat repo baru di [github.com/new](https://github.com/new) — kasih nama `habibi-api`
2. Di terminal/CMD, masuk ke folder `habibi-api`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME-KAMU/habibi-api.git
   git push -u origin main
   ```

### 2. Deploy ke Vercel
1. Buka [vercel.com](https://vercel.com) → Login pakai GitHub
2. Klik **Add New** → **Project**
3. Pilih repo `habibi-api` → klik **Import**
4. Klik **Deploy** (tidak perlu setting apa-apa)
5. Tunggu ~30 detik → dapat domain `https://habibi-api.vercel.app`

### 3. Custom Domain (opsional)
Kalau punya domain sendiri, di dashboard Vercel → Settings → Domains → Add.

## Endpoint List

Semua endpoint butuh `apikey` di query string. Daftar dulu di `/auth/register`.

| Method | Path | Deskripsi |
|---|---|---|
| POST | `/auth/register` | Daftar akun baru, dapat API key |
| GET | `/auth/profile?apikey=` | Cek profil & sisa limit |
| GET | `/api/search/youtube?q=` | Cari video YouTube |
| GET | `/api/image/qrcode?text=` | Generate QR Code |
| GET | `/api/ai/translate?text=&to=` | Terjemahkan teks |
| GET | `/api/data/cuaca?kota=` | Info cuaca |
| GET | `/api/data/jadwalsholat?kota=` | Jadwal sholat |
| GET | `/api/data/quote` | Random quote |
| GET | `/api/random/fact` | Random fact |
| GET | `/api/downloader/tiktok?url=` | Download TikTok |
| GET | `/api/utility/shortlink?url=` | Pendekkan URL |

## Tier User
- **Free**: 100 request/hari
- **Premium**: Unlimited (upgrade manual oleh admin)

---
© Habibi Official
