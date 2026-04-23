import Link from "next/link";

const features = [
  { icon: "🎵", title: "YouTube MP3", desc: "Convert video YouTube ke audio MP3 berkualitas tinggi" },
  { icon: "🎬", title: "YouTube MP4", desc: "Download video YouTube dalam berbagai resolusi" },
  { icon: "📱", title: "TikTok Downloader", desc: "Download video TikTok tanpa watermark" },
  { icon: "🤖", title: "AI Chat", desc: "Chat dengan AI canggih untuk berbagai keperluan" },
  { icon: "🌸", title: "Random Anime", desc: "Gambar anime random untuk konten kreatif" },
  { icon: "📰", title: "Berita Terkini", desc: "Headline berita terbaru dari berbagai sumber" },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <section className="py-24 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono mb-6">
          v1.0 — production ready
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight mb-6">
          REST API <span className="gradient-text">super lengkap</span><br />
          untuk bot kamu
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-10">
          Kumpulan endpoint siap pakai: downloader, AI, hiburan, dan informasi.
          Daftar gratis, dapatkan API key, langsung pakai.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/register" className="btn-primary text-base px-6 py-3">Mulai Gratis →</Link>
          <Link href="/docs" className="btn-ghost text-base px-6 py-3">Lihat Dokumentasi</Link>
        </div>

        <div className="mt-12 max-w-2xl mx-auto code-block text-left">
          <div className="text-muted text-xs mb-2">$ curl</div>
          <pre className="text-success">
{`curl "https://your-app.vercel.app/api/v1/anime?apikey=YOUR_KEY"`}
          </pre>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-2">Fitur Lengkap</h2>
        <p className="text-muted text-center mb-10">6 endpoint utama, terus bertambah</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card hover:border-accent/50 transition-colors">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="card bg-gradient-to-br from-accent/10 to-accent2/10 text-center">
          <h2 className="text-3xl font-bold mb-3">Siap dipakai dalam 30 detik</h2>
          <p className="text-muted mb-6">Daftar → generate API key → request endpoint. Done.</p>
          <Link href="/register" className="btn-primary text-base px-6 py-3">Buat Akun Gratis</Link>
        </div>
      </section>
    </div>
  );
}
