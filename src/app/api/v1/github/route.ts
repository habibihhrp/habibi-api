import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/github");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const username = url.searchParams.get("username");
  if (!username) return jsonErr("Param `username` wajib. Contoh: ?username=torvalds");

  try {
    const r = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: { "user-agent": "habibi-api" }, cache: "no-store",
    });
    if (r.status === 404) return jsonErr("User GitHub tidak ditemukan", 404);
    if (!r.ok) return jsonErr("Sumber GitHub gagal dijangkau", 502);
    const j = await r.json();
    return jsonOk({
      username: j.login, name: j.name, bio: j.bio, avatar: j.avatar_url,
      followers: j.followers, following: j.following, repos: j.public_repos,
      company: j.company, location: j.location, blog: j.blog,
      created_at: j.created_at, url: j.html_url,
    }, auth.ctx);
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal fetch", 502);
  }
}
