"use client";
import { useState } from "react";

const endpoints = [
  { value: "anime", label: "GET /anime", method: "GET", path: "/api/v1/anime", params: ["category"] },
  { value: "news", label: "GET /news", method: "GET", path: "/api/v1/news", params: ["category"] },
  { value: "tiktok", label: "GET /tiktok", method: "GET", path: "/api/v1/tiktok", params: ["url"] },
  { value: "ytmp3", label: "GET /ytmp3", method: "GET", path: "/api/v1/ytmp3", params: ["url"] },
  { value: "ytmp4", label: "GET /ytmp4", method: "GET", path: "/api/v1/ytmp4", params: ["url", "quality"] },
  { value: "ai", label: "POST /ai", method: "POST", path: "/api/v1/ai", params: ["prompt"] },
];

export default function PlaygroundPage() {
  const [sel, setSel] = useState(endpoints[0]);
  const [apikey, setApikey] = useState("");
  const [params, setParams] = useState<Record<string, string>>({});
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setOut("");
    try {
      let res;
      if (sel.method === "GET") {
        const url = new URL(sel.path, window.location.origin);
        url.searchParams.set("apikey", apikey);
        for (const k of sel.params) if (params[k]) url.searchParams.set(k, params[k]);
        res = await fetch(url.toString());
      } else {
        res = await fetch(sel.path, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ apikey, ...params }),
        });
      }
      const data = await res.json();
      setOut(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setOut("Error: " + e.message);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">API Playground</h1>
      <p className="text-muted mb-8">Test endpoint langsung dari browser.</p>

      <div className="card space-y-4">
        <div>
          <label className="text-sm text-muted block mb-1">Endpoint</label>
          <select
            className="input"
            value={sel.value}
            onChange={(e) => {
              setSel(endpoints.find((x) => x.value === e.target.value)!);
              setParams({});
            }}
          >
            {endpoints.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm text-muted block mb-1">API Key</label>
          <input className="input" value={apikey} onChange={(e) => setApikey(e.target.value)} placeholder="hit-xxxxxx" />
        </div>

        {sel.params.map((p) => (
          <div key={p}>
            <label className="text-sm text-muted block mb-1">{p}</label>
            <input
              className="input"
              value={params[p] || ""}
              onChange={(e) => setParams({ ...params, [p]: e.target.value })}
            />
          </div>
        ))}

        <button onClick={run} disabled={loading || !apikey} className="btn-primary w-full">
          {loading ? "Loading..." : "▶ Run"}
        </button>

        {out && (
          <div>
            <div className="text-sm text-muted mb-1">Response</div>
            <pre className="code-block max-h-96">{out}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
