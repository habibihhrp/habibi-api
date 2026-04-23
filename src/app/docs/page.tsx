const endpoints = [
  {
    method: "GET",
    path: "/api/v1/ytmp3",
    desc: "Convert video YouTube ke MP3",
    params: [{ name: "url", required: true, desc: "URL video YouTube" }],
    example: '/api/v1/ytmp3?url=https://youtu.be/dQw4w9WgXcQ&apikey=YOUR_KEY',
  },
  {
    method: "GET",
    path: "/api/v1/ytmp4",
    desc: "Download video YouTube MP4",
    params: [
      { name: "url", required: true, desc: "URL video YouTube" },
      { name: "quality", required: false, desc: "lowest | highest (default: highest)" },
    ],
    example: '/api/v1/ytmp4?url=https://youtu.be/dQw4w9WgXcQ&apikey=YOUR_KEY',
  },
  {
    method: "GET",
    path: "/api/v1/tiktok",
    desc: "Download video TikTok tanpa watermark",
    params: [{ name: "url", required: true, desc: "URL video TikTok" }],
    example: '/api/v1/tiktok?url=https://vt.tiktok.com/xxx&apikey=YOUR_KEY',
  },
  {
    method: "POST",
    path: "/api/v1/ai",
    desc: "AI chat (powered by GPT)",
    params: [
      { name: "prompt", required: true, desc: "Pertanyaan / instruksi" },
      { name: "system", required: false, desc: "System prompt (default: helpful assistant)" },
    ],
    example: 'POST /api/v1/ai\n{ "prompt": "Halo, kenalin diri kamu", "apikey": "YOUR_KEY" }',
  },
  {
    method: "GET",
    path: "/api/v1/anime",
    desc: "Random gambar anime",
    params: [{ name: "category", required: false, desc: "waifu | neko | shinobu | megumin (default: waifu)" }],
    example: '/api/v1/anime?category=neko&apikey=YOUR_KEY',
  },
  {
    method: "GET",
    path: "/api/v1/news",
    desc: "Berita terkini",
    params: [{ name: "category", required: false, desc: "tech | science (default: tech)" }],
    example: '/api/v1/news?apikey=YOUR_KEY',
  },
];

export default function DocsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">Documentation</h1>
      <p className="text-muted mb-8">Semua endpoint butuh API key. Daftar gratis untuk dapat key.</p>

      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-3">Authentication</h2>
        <p className="text-muted mb-4">Kirim API key lewat salah satu cara berikut:</p>
        <ul className="space-y-2 mb-4">
          <li><code className="font-mono text-accent">?apikey=YOUR_KEY</code> di query string</li>
          <li><code className="font-mono text-accent">x-api-key: YOUR_KEY</code> di header</li>
          <li><code className="font-mono text-accent">Authorization: Bearer YOUR_KEY</code> di header</li>
        </ul>
        <pre className="code-block">{`curl "https://your-app.vercel.app/api/v1/anime?apikey=YOUR_KEY"`}</pre>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-3">Rate Limit</h2>
        <p className="text-muted">Free plan: <span className="text-text font-semibold">1.000 request / hari</span> per API key. Setiap response berisi <code className="text-accent">remaining</code> sisa quota.</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Endpoints</h2>
      <div className="space-y-4">
        {endpoints.map((e) => (
          <div key={e.path} className="card">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className={e.method === "GET" ? "tag-get" : "tag-post"}>{e.method}</span>
              <code className="font-mono font-semibold">{e.path}</code>
            </div>
            <p className="text-muted text-sm mb-3">{e.desc}</p>
            {e.params.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-muted uppercase tracking-wider mb-1">Parameters</div>
                <table className="text-sm w-full">
                  <tbody>
                    {e.params.map((p) => (
                      <tr key={p.name} className="border-t border-border">
                        <td className="py-2 pr-4 font-mono text-accent">{p.name}</td>
                        <td className="py-2 pr-4 text-xs">{p.required ? <span className="text-danger">required</span> : <span className="text-muted">optional</span>}</td>
                        <td className="py-2 text-muted text-sm">{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <pre className="code-block">{e.example}</pre>
          </div>
        ))}
      </div>

      <div className="card mt-8">
        <h2 className="text-xl font-bold mb-3">Response Format</h2>
        <pre className="code-block">{`{
  "status": true,
  "creator": "Habibi API",
  "remaining": 998,
  "result": { ... }
}`}</pre>
      </div>
    </div>
  );
}
