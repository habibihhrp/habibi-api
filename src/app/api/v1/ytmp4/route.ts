import { NextRequest } from "next/server";
import ytdl from "@distube/ytdl-core";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/ytmp4");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const target = url.searchParams.get("url");
  const quality = (url.searchParams.get("quality") || "highest").toLowerCase();
  if (!target || !ytdl.validateURL(target)) return jsonErr("URL YouTube tidak valid");

  try {
    const info = await ytdl.getInfo(target);
    const formats = ytdl
      .filterFormats(info.formats, "videoandaudio")
      .filter((f) => f.url && f.container === "mp4")
      .sort((a, b) => (b.height || 0) - (a.height || 0));

    if (formats.length === 0) return jsonErr("Format video tidak ditemukan", 404);
    const chosen = quality === "lowest" ? formats[formats.length - 1] : formats[0];

    return jsonOk(
      {
        title: info.videoDetails.title,
        author: info.videoDetails.author?.name,
        duration: Number(info.videoDetails.lengthSeconds),
        thumbnail: info.videoDetails.thumbnails?.at(-1)?.url,
        videoId: info.videoDetails.videoId,
        video: {
          url: chosen.url,
          quality: chosen.qualityLabel,
          mimeType: chosen.mimeType,
          container: chosen.container,
        },
        availableQualities: formats.map((f) => f.qualityLabel).filter(Boolean),
      },
      auth.ctx
    );
  } catch (e: any) {
    return jsonErr("Gagal mengambil info video: " + (e?.message || "unknown"), 502);
  }
}
