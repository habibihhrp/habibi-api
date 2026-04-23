"use client";
import { useState } from "react";

type Ep = { value: string; label: string; method: "GET" | "POST"; path: string; params: { name: string; required?: boolean; placeholder?: string }[] };

const endpoints: Ep[] = [
  { value: "anime", label: "GET /anime — random anime", method: "GET", path: "/api/v1/anime", params: [{ name: "category", placeholder: "waifu | neko | megumin" }] },
  { value: "meme", label: "GET /meme — random meme", method: "GET", path: "/api/v1/meme", params: [] },
  { value: "quote", label: "GET /quote — quote motivasi", method: "GET", path: "/api/v1/quote", params: [] },
  { value: "joke", label: "GET /joke — joke random", method: "GET", path: "/api/v1/joke", params: [] },
  { value: "news", label: "GET /news — berita terkini", method: "GET", path: "/api/v1/news", params: [{ name: "category", placeholder: "tech | science" }] },
  { value: "weather", label: "GET /weather — cuaca", method: "GET", path: "/api/v1/weather", params: [{ name: "city", required: true, placeholder: "Jakarta" }] },
  { value: "translate", label: "GET /translate — translate", method: "GET", path: "/api/v1/translate", params: [{ name: "text", required: true, placeholder: "hello world" }, { name: "to", placeholder: "id" }, { name: "from", placeholder: "auto" }] },
  { value: "qrcode", label: "GET /qrcode — QR code generator", method: "GET", path: "/api/v1/qrcode", params: [{ name: "text", required: true, placeholder: "https://habibi-api.vercel.app" }, { name: "size", placeholder: "300" }] },
  { value: "jadwal-sholat", label: "GET /jadwal-sholat — jadwal sholat", method: "GET", path: "/api/v1/jadwal-sholat", params: [{ name: "city", placeholder: "Jakarta" }, { name: "country", placeholder: "Indonesia" }] },
  { value: "currency", label: "GET /currency — konversi kurs", method: "GET", path: "/api/v1/currency", params: [{ name: "from", placeholder: "USD" }, { name: "to", placeholder: "IDR" }, { name: "amount", placeholder: "1" }] },
  { value: "wikipedia", label: "GET /wikipedia — artikel wiki", method: "GET", path: "/api/v1/wikipedia", params: [{ name: "q", required: true, placeholder: "Indonesia" }, { name: "lang", placeholder: "id" }] },
  { value: "ip", label: "GET /ip — IP lookup", method: "GET", path: "/api/v1/ip", params: [{ name: "ip", placeholder: "8.8.8.8" }] },
  { value: "github", label: "GET /github — GitHub user", method: "GET", path: "/api/v1/github", params: [{ name: "username", required: true, placeholder: "torvalds" }] },
  { value: "tiktok", label: "GET /tiktok — TikTok download", method: "GET", path: "/api/v1/tiktok", params: [{ name: "url", required: true, placeholder: "https://vt.tiktok.com/..." }] },
  { value: "ytmp3", label: "GET /ytmp3 — YouTube → MP3", method: "GET", path: "/api/v1/ytmp3", params: [{ name: "url", required: true, placeholder: "https://youtu.be/..." }] },
  { value: "ytmp4", label: "GET /ytmp4 — YouTube → MP4", method: "GET", path: "/api/v1/ytmp4", params: [{ name: "url", required: true, placeholder: "https://youtu.be/..." }, { name: "quality", placeholder: "highest | lowest" }] },
  { value: "ai", label: "POST /ai — AI Chat (GPT)", method: "POST", path: "/api/v1/ai", params: [{ name: "prompt", required: true, placeholder: "Halo, kenalin diri kamu" }, { name: "system", placeholder: "Kamu asisten ramah (optional)" }] },
];

export default function PlaygroundPage() {
  const [sel, setSel] = useState(endpoints[0]);
  const [apikey, setApikey] = useState("");
  const [params, setParams] = useState<Record<string, string>>({});
  const [out, setOut] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);

  async function run() {
    setLoading(true);
    setOut("");
    setStatus(null);
    setElapsed(null);
    const t0 = Date.now();
    try {
      let res;
      if (sel.method === "GET") {
        const url = new URL(sel.path, window.location.origin);
        url.searchParams.set("apikey", apikey);
        for (const p of sel.params) if (params[p.name]) url.searchParams.set(p.name, params[p.name]);
        res = await fetch(url.toString());
      } else {
        const body: any = { apikey };
        for (const p of sel.params) if (params[p.name]) body[p.name] = params[p.name];
        res = await fetch(sel.path, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setStatus(res.status);
      setElapsed(Date.now() - t0);
      const text = await res.text();
      try { setOut(JSON.stringify(JSON.parse(text), null, 2)); } catch { setOut(text); }
    } catch (e: any) {
      setOut("Error: " + e.message);
    }
    setLoading(false);
  }

  const buildUrl = () => {
    if (sel.method !== "GET") return sel.path;
    const u = new URL(sel.path, typeof window !== "undefined" ? window.location.origin : "https://habibi-api.vercel.app");
    if (apikey) u.searchParams.set("apikey", apikey);
    for (const p of sel.params) if (params[p.name]) u.searchParams.set(p.name, params[p.name]);
    return u.pathname + u.search;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">API Playground</h1>
      <p className="text-muted mb-8">Test endpoint langsung dari browser — gak perlu Postman.</p>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        <div className="card space-y-4">
          <div>
            <label className="text-sm text-muted block mb-1">Endpoint</label>
            <select
              className="input"
              value={sel.value}
              onChange={(e) => { setSel(endpoints.find((x) => x.value === e.target.value)!); setParams({}); setOut(""); setStatus(null); }}
            >
              {endpoints.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm text-muted block mb-1">API Key</label>
            <input className="input font-mono text-sm" value={apikey} onChange={(e) => setApikey(e.target.value)} placeholder="hit-xxxxxxxxxxxx" />
          </div>

          {sel.params.map((p) => (
            <div key={p.name}>
              <label className="text-sm text-muted block mb-1">
                {p.name} {p.required && <span className="text-danger text-xs">(required)</span>}
              </label>
              <input
                className="input font-mono text-sm"
                value={params[p.name] || ""}
                placeholder={p.placeholder || ""}
                onChange={(e) => setParams({ ...params, [p.name]: e.target.value })}
              />
            </div>
          ))}

          <button onClick={run} disabled={loading || !apikey} className="btn-primary w-full">
            {loading ? "⏳ Loading..." : "▶ Run Request"}
          </button>

          <div className="text-xs text-muted font-mono break-all pt-2 border-t border-border">
            <div className="uppercase tracking-wider mb-1 text-[10px]">Preview URL</div>
            <span className="text-accent">{sel.method}</span> {buildUrl()}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-sm text-muted">Response</div>
            {status !== null && (
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${status < 400 ? "bg-success/20 text-success" : "bg-danger/20 text-danger"}`}>
                {status}
              </span>
            )}
            {elapsed !== null && <span className="text-xs text-muted ml-auto">{elapsed}ms</span>}
          </div>
          {out ? (
            <pre className="code-block font-mono text-xs max-h-[500px] overflow-auto whitespace-pre-wrap">{out}</pre>
          ) : (
            <div className="text-sm text-muted italic">Response akan tampil di sini setelah Run.</div>
          )}
        </div>
      </div>
    </div>
  );
}
