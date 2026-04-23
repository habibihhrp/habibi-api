import Link from "next/link";

const categories = [
  {
    name: "Downloader",
    color: "from-pink-500/20 to-rose-500/20",
    icon: "⬇️",
    items: [
      { path: "/ytmp3", desc: "YouTube → MP3" },
      { path: "/ytmp4", desc: "YouTube → MP4" },
      { path: "/tiktok", desc: "TikTok no watermark" },
    ],
  },
  {
    name: "AI & Tools",
    color: "from-violet-500/20 to-purple-500/20",
    icon: "🤖",
    items: [
      { path: "/ai", desc: "GPT chat" },
      { path: "/translate", desc: "Translate multi-bahasa" },
      { path: "/qrcode", desc: "Generate QR code" },
    ],
  },
  {
    name: "Informasi",
    color: "from-cyan-500/20 to-blue-500/20",
    icon: "🌐",
    items: [
      { path: "/weather", desc: "Cuaca real-time" },
      { path: "/news", desc: "Berita terkini" },
      { path: "/jadwal-sholat", desc: "Jadwal sholat" },
      { path: "/currency", desc: "Kurs mata uang" },
      { path: "/wikipedia", desc: "Artikel Wikipedia" },
      { path: "/ip", desc: "IP lookup" },
      { path: "/github", desc: "Profil GitHub" },
    ],
  },
  {
    name: "Hiburan",
    color: "from-amber-500/20 to-orange-500/20",
    icon: "✨",
    items: [
      { path: "/anime", desc: "Random anime" },
      { path: "/meme", desc: "Random meme" },
      { path: "/quote", desc: "Quote motivasi" },
      { path: "/joke", desc: "Joke random" },
    ],
  },
];

const stats = [
  { value: "17+", label: "API Endpoints" },
  { value: "1.000", label: "Request / hari" },
  { value: "99.9%", label: "Uptime target" },
  { value: "Free", label: "Forever" },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Hero */}
      <section className="py-24 text-center relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-accent/20 to-accent2/20 blur-3xl" />
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono mb-6">
          v1.0 — production ready
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight mb-6">
          REST API <span className="gradient-text">super lengkap</span><br />
          untuk bot & aplikasi kamu
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-10">
          17+ endpoint siap pakai. Downloader, AI, translate, weather, berita, hiburan, dan
          utility. Daftar gratis, generate API key, langsung pakai.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/register" className="btn-primary text-base px-6 py-3">Mulai Gratis →</Link>
          <Link href="/docs" className="btn-ghost text-base px-6 py-3">Lihat Dokumentasi</Link>
        </div>

        <div className="mt-12 max-w-2xl mx-auto code-block text-left font-mono text-sm">
          <div className="text-muted text-xs mb-2">$ curl</div>
          <pre className="text-success whitespace-pre-wrap">
{`curl "https://habibi-api.vercel.app/api/v1/translate?text=hello&to=id&apikey=YOUR_KEY"`}
          </pre>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card text-center">
              <div className="text-3xl font-extrabold gradient-text">{s.value}</div>
              <div className="text-xs text-muted mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Endpoints by category */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">Semua fitur dalam 1 API</h2>
          <p className="text-muted">Dikategorikan biar gampang. Terus ditambah setiap minggu.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {categories.map((cat) => (
            <div key={cat.name} className={`card bg-gradient-to-br ${cat.color} border-border`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{cat.icon}</div>
                <h3 className="text-xl font-bold">{cat.name}</h3>
                <span className="ml-auto text-xs text-muted">{cat.items.length} endpoint</span>
              </div>
              <ul className="space-y-2">
                {cat.items.map((e) => (
                  <li key={e.path} className="flex items-baseline gap-3 text-sm">
                    <code className="font-mono text-accent">{e.path}</code>
                    <span className="text-muted">— {e.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Response format */}
      <section className="py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Response yang konsisten</h2>
          <p className="text-muted mb-4">
            Setiap endpoint balikin format JSON yang sama — gampang di-parse di bahasa manapun.
            Sisa quota, creator, dan data result selalu ada di tempat yang sama.
          </p>
          <ul className="space-y-2 text-sm">
            <li>✓ Authentication via query, header, atau Bearer token</li>
            <li>✓ Rate limit tracking otomatis per API key</li>
            <li>✓ Error messages yang informatif</li>
            <li>✓ CORS ready untuk frontend app</li>
          </ul>
        </div>
        <pre className="code-block font-mono text-sm">
{`{
  "status": true,
  "creator": "Habibi API",
  "remaining": 998,
  "result": {
    "from": "en",
    "to": "id",
    "translated": "halo dunia"
  }
}`}
        </pre>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="card bg-gradient-to-br from-accent/20 to-accent2/20 text-center border-accent/30">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Siap dipakai dalam 30 detik</h2>
          <p className="text-muted mb-6 max-w-xl mx-auto">
            Daftar gratis → generate API key → pasang di bot/app kamu. Gak perlu kartu kredit,
            selamanya gratis untuk 1.000 request per hari.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/register" className="btn-primary text-base px-6 py-3">Buat Akun Gratis</Link>
            <Link href="/playground" className="btn-ghost text-base px-6 py-3">Coba Playground</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
