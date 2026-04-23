"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setErr(data.message || "Login gagal");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="card">
        <h1 className="text-2xl font-bold mb-1">Selamat datang kembali</h1>
        <p className="text-muted text-sm mb-6">Login untuk akses dashboard kamu</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-muted block mb-1">Email</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Password</label>
            <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {err && <div className="text-danger text-sm">{err}</div>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? "..." : "Login"}</button>
        </form>
        <p className="text-sm text-muted mt-4 text-center">
          Belum punya akun? <Link href="/register" className="text-accent">Daftar</Link>
        </p>
      </div>
    </div>
  );
}
