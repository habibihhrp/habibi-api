import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/news");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const cat = (url.searchParams.get("category") || "tech").toLowerCase();

  try {
    if (cat === "science" || cat === "space") {
      const r = await fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=15", { cache: "no-store" });
      const data = await r.json();
      const articles = (data.results || []).map((a: any) => ({
        title: a.title,
        summary: a.summary,
        url: a.url,
        image: a.image_url,
        source: a.news_site,
        publishedAt: a.published_at,
      }));
      return jsonOk({ category: cat, count: articles.length, articles }, auth.ctx);
    }

    // default: tech (Hacker News top stories)
    const idsRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", { cache: "no-store" });
    const ids: number[] = await idsRes.json();
    const top = ids.slice(0, 15);
    const stories = await Promise.all(
      top.map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) => r.json())
      )
    );
    const articles = stories
      .filter((s) => s && s.title)
      .map((s: any) => ({
        title: s.title,
        url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        source: "Hacker News",
        score: s.score,
        author: s.by,
        publishedAt: new Date((s.time || 0) * 1000).toISOString(),
      }));
    return jsonOk({ category: "tech", count: articles.length, articles }, auth.ctx);
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal fetch news", 502);
  }
}
