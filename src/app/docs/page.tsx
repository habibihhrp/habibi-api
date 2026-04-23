const groups = [
  {
    name: "Authentication",
    items: [
      {
        method: "POST", path: "/api/auth/register", desc: "Daftar akun baru",
        params: [
          { name: "username", required: true, desc: "3-32 char, huruf/angka/_" },
          { name: "email", required: true, desc: "Email valid" },
          { name: "password", required: true, desc: "Min 6 char" },
        ],
        example: 'POST /api/auth/register\n{"username":"habibi","email":"a@b.com","password":"secret123"}',
      },
      {
        method: "POST", path: "/api/auth/login", desc: "Login — balikin cookie session",
        params: [
          { name: "emailOrUsername", required: true, desc: "Email atau username" },
          { name: "password", required: true, desc: "Password" },
        ],
        example: 'POST /api/auth/login\n{"emailOrUsername":"habibi","password":"secret123"}',
      },
    ],
  },
  {
    name: "Downloader",
    items: [
      {
        method: "GET", path: "/api/v1/ytmp3", desc: "Convert video YouTube ke MP3",
        params: [{ name: "url", required: true, desc: "URL video YouTube" }],
        example: '/api/v1/ytmp3?url=https://youtu.be/dQw4w9WgXcQ&apikey=YOUR_KEY',
      },
      {
        method: "GET", path: "/api/v1/ytmp4", desc: "Download video YouTube MP4",
        params: [
          { name: "url", required: true, desc: "URL video YouTube" },
          { name: "quality", required: false, desc: "lowest | highest (default: highest)" },
        ],
        example: '/api/v1/ytmp4?url=https://youtu.be/dQw4w9WgXcQ&apikey=YOUR_KEY',
      },
      {
        method: "GET", path: "/api/v1/tiktok", desc: "Download TikTok tanpa watermark",
        params: [{ name: "url", required: true, desc: "URL video TikTok" }],
        example: '/api/v1/tiktok?url=https://vt.tiktok.com/xxx&apikey=YOUR_KEY',
      },
    ],
  },
  {
    name: "AI & Tools",
    items: [
      {
        method: "POST", path: "/api/v1/ai", desc: "AI chat via GPT",
        params: [
          { name: "prompt", required: true, desc: "Pertanyaan / instruksi" },
          { name: "system", required: false, desc: "System prompt kustom" },
        ],
        example: 'POST /api/v1/ai\n{"prompt":"Halo, kenalin diri kamu","apikey":"YOUR_KEY"}',
      },
      {
        method: "GET", path: "/api/v1/translate", desc: "Translate teks ke bahasa lain",
        params: [
          { name: "text", required: true, desc: "Teks yang mau diterjemahkan" },
          { name: "to", required: false, desc: "Kode bahasa tujuan (default: id)" },
          { name: "from", required: false, desc: "Kode bahasa sumber (default: auto)" },
        ],
        example: '/api/v1/translate?text=hello+world&to=id&apikey=YOUR_KEY',
      },
      {
        method: "GET", path: "/api/v1/qrcode", desc: "Generate QR code",
        params: [
          { name: "text", required: true, desc: "Teks/URL untuk QR" },
          { name: "size", required: false, desc: "Ukuran px (default: 300)" },
        ],
        example: '/api/v1/qrcode?text=https://habibi-api.vercel.app&apikey=YOUR_KEY',
      },
    ],
  },
  {
    name: "Informasi",
    items: [
      {
        method: "GET", path: "/api/v1/weather", desc: "Cuaca real-time by city",
        params: [{ name: "city", required: true, desc: "Nama kota" }],
        example: '/api/v1/weather?city=Jakarta&apikey=YOUR_KEY',
      },
      {
        method: "GET", path: "/api/v1/news", desc: "Berita terkini",
        params: [{ name: "category", required: false, desc: "tech | science (default: tech)" }],
        example: '/api/v1/news?category=tech&apikey=YOUR_KEY',
      },
      {
        method: "GET", path: "/api/v1/jadwal-sholat", desc: "Jadwal sholat per kota",
        params: [
          { name: "city", required: false, desc: "Nama kota (default: Jakarta)" },
          { name: "country", required: false, desc: "Nama negara (default: Indonesia)" },
        ],
        example: '/api/v1/jadwal-sholat?city=Jakarta&apikey=YOUR_KEY',
      },
      {
        method: "GET", path: "/api/v1/currency", desc: "Konversi kurs mata uang",
        params: [
          { name: "from", required: false, desc: "Dari (default: USD)" },
          { name: "to", required: false, desc: "Ke (default: IDR)" },
          { name: "amount", required: false, desc: "Jumlah (default: 1)" },
        ],
        example: '/api/v1/currency?from=USD&to=IDR&amount=100&apikey=YOUR_KEY',
      },
      {
        method: "GET", path: "/api/v1/wikipedia", desc: "Ringkasan artikel Wikipedia",
        params: [
          { name: "q", required: true, desc: "Judul artikel" },
          { name: "lang", required: false, desc: "Bahasa (default: id)" },
        ],
        example: '/api/v1/wikipedia?q=Indonesia&apikey=YOUR_KEY',
      },
      {
        method: "GET", path: "/api/v1/ip", desc: "IP lookup (geo, ISP)",
        params: [{ name: "ip", required: false, desc: "IP target (default: IP kamu)" }],
        example: '/api/v1/ip?ip=8.8.8.8&apikey=YOUR_KEY',
      },
      {
        method: "GET", path: "/api/v1/github", desc: "Profil user GitHub",
        params: [{ name: "username", required: true, desc: "Username GitHub" }],
        example: '/api/v1/github?username=torvalds&apikey=YOUR_KEY',
      },
    ],
  },
  {
    name: "Hiburan",
    items: [
      {
        method: "GET", path: "/api/v1/anime", desc: "Random gambar anime",
        params: [{ name: "category", required: false, desc: "waifu | neko | shinobu | megumin | hug | kiss | wink" }],
        example: '/api/v1/anime?category=neko&apikey=YOUR_KEY',
      },
      {
        method: "GET", path: "/api/v1/meme", desc: "Random meme",
        params: [],
        example: '/api/v1/meme?apikey=YOUR_KEY',
      },
      {
        method: "GET", path: "/api/v1/quote", desc: "Quote motivasi random",
        params: [],
        example: '/api/v1/quote?apikey=YOUR_KEY',
      },
      {
        method: "GET", path: "/api/v1/joke", desc: "Joke/humor random",
        params: [],
        example: '/api/v1/joke?apikey=YOUR_KEY',
      },
    ],
  },
];

function slug(s: string) { return s.replace(/\W+/g, "-").toLowerCase(); }

export default function DocsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">Documentation</h1>
      <p className="text-muted mb-8">Semua endpoint butuh API key kecuali auth. Daftar gratis untuk dapat key 🔑</p>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="md:sticky md:top-24 h-fit">
          <div className="text-xs text-muted uppercase tracking-wider mb-3">Navigasi</div>
          <ul className="space-y-1 text-sm">
            <li><a href="#auth-header" className="text-muted hover:text-accent">Authentication</a></li>
            <li><a href="#rate-limit" className="text-muted hover:text-accent">Rate Limit</a></li>
            <li><a href="#response" className="text-muted hover:text-accent">Response Format</a></li>
            <li className="pt-3 text-xs text-muted uppercase tracking-wider">Endpoints</li>
            {groups.map((g) => (
              <li key={g.name}>
                <a href={`#${slug(g.name)}`} className="text-muted hover:text-accent">{g.name} <span className="text-xs">({g.items.length})</span></a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <div>
          <div id="auth-header" className="card mb-6">
            <h2 className="text-xl font-bold mb-3">Authentication</h2>
            <p className="text-muted mb-4">Kirim API key lewat salah satu cara berikut:</p>
            <ul className="space-y-2 mb-4 text-sm">
              <li><code className="font-mono text-accent">?apikey=YOUR_KEY</code> — query string</li>
              <li><code className="font-mono text-accent">x-api-key: YOUR_KEY</code> — header</li>
              <li><code className="font-mono text-accent">Authorization: Bearer YOUR_KEY</code> — header</li>
            </ul>
            <pre className="code-block font-mono text-sm">{`curl "https://habibi-api.vercel.app/api/v1/anime?apikey=YOUR_KEY"`}</pre>
          </div>

          <div id="rate-limit" className="card mb-6">
            <h2 className="text-xl font-bold mb-3">Rate Limit</h2>
            <p className="text-muted text-sm">
              Free plan: <span className="text-text font-semibold">1.000 request / hari</span> per API key.
              Setiap response berisi <code className="text-accent">remaining</code> sisa quota. Status 429
              kalau abis.
            </p>
          </div>

          <div id="response" className="card mb-10">
            <h2 className="text-xl font-bold mb-3">Response Format</h2>
            <pre className="code-block font-mono text-sm">{`{
  "status": true,
  "creator": "Habibi API",
  "remaining": 998,
  "result": { ... }
}`}</pre>
          </div>

          {groups.map((g) => (
            <section key={g.name} id={slug(g.name)} className="mb-10">
              <h2 className="text-2xl font-bold mb-4">{g.name}</h2>
              <div className="space-y-4">
                {g.items.map((e) => (
                  <div key={e.path} className="card">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={e.method === "GET" ? "tag-get" : "tag-post"}>{e.method}</span>
                      <code className="font-mono font-semibold text-sm sm:text-base">{e.path}</code>
                    </div>
                    <p className="text-muted text-sm mb-3">{e.desc}</p>
                    {e.params.length > 0 && (
                      <div className="mb-3 overflow-x-auto">
                        <div className="text-xs text-muted uppercase tracking-wider mb-1">Parameters</div>
                        <table className="text-sm w-full">
                          <tbody>
                            {e.params.map((p) => (
                              <tr key={p.name} className="border-t border-border">
                                <td className="py-2 pr-4 font-mono text-accent whitespace-nowrap">{p.name}</td>
                                <td className="py-2 pr-4 text-xs whitespace-nowrap">{p.required ? <span className="text-danger">required</span> : <span className="text-muted">optional</span>}</td>
                                <td className="py-2 text-muted text-sm">{p.desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <pre className="code-block font-mono text-xs sm:text-sm whitespace-pre-wrap">{e.example}</pre>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
