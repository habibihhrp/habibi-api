"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  user: { id: string; email: string; username: string; plan: string };
  apiKeys: { id: string; key: string; name: string; requests: number; limit: number; createdAt: string }[];
};

export function DashboardClient({ user, apiKeys: initial }: Props) {
  const router = useRouter();
  const [keys, setKeys] = useState(initial);
  const [name, setName] = useState("");
  const [reveal, setReveal] = useState<Record<string, boolean>>({});

  async function createKey() {
    const res = await fetch("/api/apikey", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name || "API Key" }),
    });
    const data = await res.json();
    if (data.apiKey) {
      setKeys([data.apiKey, ...keys]);
      setName("");
    }
  }

  async function deleteKey(id: string) {
    if (!confirm("Hapus API key ini?")) return;
    await fetch(`/api/apikey/${id}`, { method: "DELETE" });
    setKeys(keys.filter((k) => k.id !== id));
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const totalRequests = keys.reduce((s, k) => s + k.requests, 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Halo, {user.username} 👋</h1>
          <p className="text-muted text-sm">{user.email}</p>
        </div>
        <button onClick={logout} className="btn-ghost">Logout</button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="text-muted text-sm">Plan</div>
          <div className="text-2xl font-bold capitalize gradient-text">{user.plan}</div>
        </div>
        <div className="card">
          <div className="text-muted text-sm">Total API Keys</div>
          <div className="text-2xl font-bold">{keys.length}</div>
        </div>
        <div className="card">
          <div className="text-muted text-sm">Total Requests</div>
          <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">API Keys</h2>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            className="input flex-1"
            placeholder="Nama key (mis: Bot WhatsApp)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={createKey} className="btn-primary">+ Buat Key</button>
        </div>

        {keys.length === 0 ? (
          <div className="text-center py-12 text-muted">
            Belum ada API key. Buat satu untuk mulai pakai API.
          </div>
        ) : (
          <div className="space-y-3">
            {keys.map((k) => {
              const pct = Math.min(100, (k.requests / k.limit) * 100);
              return (
                <div key={k.id} className="bg-panel2 border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                    <div className="font-semibold">{k.name}</div>
                    <button onClick={() => deleteKey(k.id)} className="btn-danger text-xs px-2 py-1">Hapus</button>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <code className="font-mono text-sm bg-bg px-3 py-1.5 rounded border border-border flex-1 overflow-x-auto">
                      {reveal[k.id] ? k.key : k.key.slice(0, 8) + "•".repeat(20) + k.key.slice(-4)}
                    </code>
                    <button
                      onClick={() => setReveal({ ...reveal, [k.id]: !reveal[k.id] })}
                      className="btn-ghost text-xs px-2 py-1.5"
                    >
                      {reveal[k.id] ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(k.key)}
                      className="btn-ghost text-xs px-2 py-1.5"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="text-xs text-muted mb-1">
                    {k.requests.toLocaleString()} / {k.limit.toLocaleString()} request hari ini
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-accent2"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card mt-6">
        <h3 className="font-bold mb-2">Cara pakai</h3>
        <pre className="code-block">
{`GET /api/v1/anime?apikey=YOUR_KEY
GET /api/v1/tiktok?url=https://tiktok.com/...&apikey=YOUR_KEY
GET /api/v1/ytmp3?url=https://youtu.be/...&apikey=YOUR_KEY
GET /api/v1/news?apikey=YOUR_KEY
POST /api/v1/ai  (body: { prompt, apikey })`}
        </pre>
      </div>
    </div>
  );
}
