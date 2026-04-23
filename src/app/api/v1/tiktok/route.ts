import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/tiktok");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const target = url.searchParams.get("url");
  if (!target) return jsonErr("Param 'url' wajib");
  if (!/tiktok\.com|vt\.tiktok|vm\.tiktok/i.test(target)) return jsonErr("URL bukan TikTok");

  try {
    const r = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url: target, hd: "1" }).toString(),
      cache: "no-store",
    });
    const data = await r.json();
    if (data?.code !== 0 || !data?.data) return jsonErr(data?.msg || "Gagal scrape TikTok", 502);
    const d = data.data;
    return jsonOk(
      {
        title: d.title,
        author: { username: d.author?.unique_id, nickname: d.author?.nickname, avatar: d.author?.avatar },
        duration: d.duration,
        cover: d.cover,
        video_no_watermark: d.play ? `https://www.tikwm.com${d.play}` : null,
        video_hd: d.hdplay ? `https://www.tikwm.com${d.hdplay}` : null,
        music: d.music,
        stats: { plays: d.play_count, likes: d.digg_count, comments: d.comment_count, shares: d.share_count },
      },
      auth.ctx
    );
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal fetch", 502);
  }
}
