import express from 'express';
import cors from 'cors';
import axios from 'axios';
import QRCode from 'qrcode';
import ytSearch from 'yt-search';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== SIMPLE JSON DATABASE =====
// On Vercel /tmp is the only writable dir; locally use ../data
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'users.json');

function loadDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}
function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}
function genApiKey() {
  return 'habibi-' + crypto.randomBytes(12).toString('hex');
}

const FREE_LIMIT = 100;
const today = () => new Date().toISOString().slice(0, 10);

// ===== AUTH MIDDLEWARE =====
function requireApiKey(req, res, next) {
  const apikey = req.query.apikey || req.headers['x-api-key'];
  if (!apikey) return res.status(401).json({ status: false, error: 'API key required. Daftar di /auth/register' });
  const db = loadDB();
  const user = db.users.find(u => u.apikey === apikey);
  if (!user) return res.status(403).json({ status: false, error: 'API key invalid' });
  if (user.lastReset !== today()) {
    user.usage = 0;
    user.lastReset = today();
  }
  if (user.tier === 'free' && user.usage >= FREE_LIMIT) {
    return res.status(429).json({
      status: false,
      error: `Limit harian habis (${FREE_LIMIT}/hari). Upgrade ke Premium untuk unlimited.`,
      upgrade: 'Hubungi admin via WhatsApp Channel: https://whatsapp.com/channel/0029Vb6SDXJDDmFXx0cHwF3f'
    });
  }
  user.usage++;
  saveDB(db);
  req.user = user;
  next();
}

// ===== HELPER =====
const ok = (data) => ({ status: true, creator: 'Habibi Official', result: data });
const err = (msg) => ({ status: false, error: msg });

// ===== ROOT (serve frontend) — only locally; on Vercel public/ is auto-served =====
app.use(express.static(path.join(__dirname, '..', 'public')));

// ===== AUTH ROUTES =====
app.post('/auth/register', (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) return res.status(400).json(err('username & email required'));
  const db = loadDB();
  if (db.users.find(u => u.email === email)) return res.status(400).json(err('Email sudah terdaftar'));
  const apikey = genApiKey();
  const user = {
    username, email, apikey,
    tier: 'free',
    usage: 0,
    lastReset: today(),
    createdAt: Date.now()
  };
  db.users.push(user);
  saveDB(db);
  res.json(ok({ apikey, tier: user.tier, message: `Akun berhasil dibuat. Simpan API key kamu!` }));
});

app.get('/auth/profile', (req, res) => {
  const apikey = req.query.apikey;
  if (!apikey) return res.status(401).json(err('apikey required'));
  const db = loadDB();
  const user = db.users.find(u => u.apikey === apikey);
  if (!user) return res.status(403).json(err('API key invalid'));
  if (user.lastReset !== today()) { user.usage = 0; user.lastReset = today(); saveDB(db); }
  const limit = user.tier === 'premium' ? 'unlimited' : FREE_LIMIT;
  res.json(ok({
    username: user.username, email: user.email, tier: user.tier,
    usage: user.usage, limit, remaining: user.tier === 'premium' ? 'unlimited' : (FREE_LIMIT - user.usage)
  }));
});

// ===== API ENDPOINTS =====

// Status / index
app.get('/api', (req, res) => res.json(ok({
  name: 'Habibi API',
  version: '1.0.0',
  channel: 'https://whatsapp.com/channel/0029Vb6SDXJDDmFXx0cHwF3f',
  youtube: 'https://youtube.com/@habibi_hosting',
  docs: '/'
})));

// 1. YouTube Search
app.get('/api/search/youtube', requireApiKey, async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json(err('Param q required'));
    const r = await ytSearch(q);
    const list = r.videos.slice(0, 10).map(v => ({
      title: v.title, url: v.url, thumbnail: v.thumbnail,
      duration: v.timestamp, views: v.views, author: v.author?.name
    }));
    res.json(ok(list));
  } catch (e) { res.status(500).json(err(e.message)); }
});

// 2. QR Code generator
app.get('/api/image/qrcode', requireApiKey, async (req, res) => {
  try {
    const text = req.query.text;
    if (!text) return res.status(400).json(err('Param text required'));
    const buffer = await QRCode.toBuffer(text, { width: 512, margin: 2 });
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  } catch (e) { res.status(500).json(err(e.message)); }
});

// 3. Translate (MyMemory free API)
app.get('/api/ai/translate', requireApiKey, async (req, res) => {
  try {
    const { text, to = 'id', from = 'auto' } = req.query;
    if (!text) return res.status(400).json(err('Param text required'));
    const r = await axios.get('https://api.mymemory.translated.net/get', {
      params: { q: text, langpair: `${from}|${to}` }
    });
    res.json(ok({ from, to, original: text, translated: r.data.responseData.translatedText }));
  } catch (e) { res.status(500).json(err(e.message)); }
});

// 4. Cuaca (Open-Meteo free, geocoding + forecast)
app.get('/api/data/cuaca', requireApiKey, async (req, res) => {
  try {
    const kota = req.query.kota;
    if (!kota) return res.status(400).json(err('Param kota required'));
    const geo = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: { name: kota, count: 1, language: 'id' }
    });
    if (!geo.data.results?.length) return res.status(404).json(err('Kota tidak ditemukan'));
    const { latitude, longitude, name, country } = geo.data.results[0];
    const w = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: { latitude, longitude, current_weather: true, timezone: 'auto' }
    });
    const cw = w.data.current_weather;
    res.json(ok({
      kota: name, negara: country,
      suhu: `${cw.temperature}°C`,
      angin: `${cw.windspeed} km/h`,
      kondisi_kode: cw.weathercode,
      waktu: cw.time
    }));
  } catch (e) { res.status(500).json(err(e.message)); }
});

// 5. Jadwal Sholat (api.myquran.com - free)
app.get('/api/data/jadwalsholat', requireApiKey, async (req, res) => {
  try {
    const kota = req.query.kota;
    if (!kota) return res.status(400).json(err('Param kota required'));
    const cariKota = await axios.get(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(kota)}`);
    if (!cariKota.data.data?.length) return res.status(404).json(err('Kota tidak ditemukan'));
    const id = cariKota.data.data[0].id;
    const namaKota = cariKota.data.data[0].lokasi;
    const tgl = new Date().toISOString().slice(0, 10);
    const j = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${id}/${tgl}`);
    res.json(ok({ kota: namaKota, tanggal: tgl, jadwal: j.data.data.jadwal }));
  } catch (e) { res.status(500).json(err(e.message)); }
});

// 6. Random Quote
const QUOTES = [
  { text: 'Kebaikan kecil yang konsisten lebih berarti daripada kebaikan besar yang sekali.', author: 'Anonim' },
  { text: 'Hidup adalah 10% apa yang terjadi padamu, 90% bagaimana kamu meresponsnya.', author: 'Charles R. Swindoll' },
  { text: 'Tidak ada yang mustahil bagi orang yang mau berusaha.', author: 'Alexander Agung' },
  { text: 'Sukses bukan kebetulan, itu adalah kerja keras, ketekunan, belajar, dan cinta pada apa yang kamu lakukan.', author: 'Pelé' },
  { text: 'Mulailah dari mana kamu berada. Gunakan apa yang kamu punya. Lakukan apa yang kamu bisa.', author: 'Arthur Ashe' },
];
app.get('/api/data/quote', requireApiKey, (req, res) => {
  res.json(ok(QUOTES[Math.floor(Math.random() * QUOTES.length)]));
});

// 7. Random Fact (uselessfacts free)
app.get('/api/random/fact', requireApiKey, async (req, res) => {
  try {
    const r = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
    res.json(ok({ fact: r.data.text, source: r.data.source_url }));
  } catch (e) { res.status(500).json(err(e.message)); }
});

// 8. TikTok Downloader (tikwm.com free public)
app.get('/api/downloader/tiktok', requireApiKey, async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json(err('Param url required'));
    const r = await axios.post('https://www.tikwm.com/api/', { url, hd: 1 });
    if (r.data.code !== 0) return res.status(500).json(err(r.data.msg || 'Failed'));
    const d = r.data.data;
    res.json(ok({
      title: d.title,
      author: d.author?.nickname,
      cover: d.cover,
      video_url: d.play,
      video_hd: d.hdplay,
      music_url: d.music,
      duration: d.duration
    }));
  } catch (e) { res.status(500).json(err(e.message)); }
});

// 9. Shortlink (is.gd free)
app.get('/api/utility/shortlink', requireApiKey, async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json(err('Param url required'));
    const r = await axios.get('https://is.gd/create.php', {
      params: { format: 'json', url }
    });
    if (r.data.errorcode) return res.status(400).json(err(r.data.errormessage));
    res.json(ok({ original: url, short: r.data.shorturl }));
  } catch (e) { res.status(500).json(err(e.message)); }
});

// 404
app.use((req, res) => res.status(404).json(err('Endpoint tidak ditemukan')));

// Only listen when running locally — Vercel serverless handles requests directly
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Habibi API running on port ${PORT}`);
  });
}

export default app;
