import { NextRequest } from "next/server";
import ytdl from "@distube/ytdl-core";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/ytmp3");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const target = url.searchParams.get("url");
  if (!target || !ytdl.validateURL(target)) return jsonErr("URL YouTube tidak valid");

  try {
    const info = await ytdl.getInfo(target);
    const audio = ytdl
      .filterFormats(info.formats, "audioonly")
      .filter((f) => f.url)
      .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0];

    if (!audio) return jsonErr("Audio stream tidak ditemukan", 404);

    return jsonOk(
      {
        title: info.videoDetails.title,
        author: info.videoDetails.author?.name,
        duration: Number(info.videoDetails.lengthSeconds),
        thumbnail: info.videoDetails.thumbnails?.at(-1)?.url,
        videoId: info.videoDetails.videoId,
        audio: {
          url: audio.url,
          mimeType: audio.mimeType,
          bitrate: audio.audioBitrate,
          container: audio.container,
        },
      },
      auth.ctx
    );
  } catch (e: any) {
    return jsonErr("Gagal mengambil info video: " + (e?.message || "unknown"), 502);
  }
}
