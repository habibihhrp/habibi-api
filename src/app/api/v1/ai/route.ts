import { NextRequest } from "next/server";
import OpenAI from "openai";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";
export const maxDuration = 60;

async function handle(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/ai");
  if (!auth.ok) return auth.res;

  let prompt: string | undefined;
  let system: string | undefined;
  if (req.method === "GET") {
    const u = new URL(req.url);
    prompt = u.searchParams.get("prompt") || u.searchParams.get("q") || undefined;
    system = u.searchParams.get("system") || undefined;
  } else {
    const body = await req.json().catch(() => ({}));
    prompt = body?.prompt || body?.q;
    system = body?.system;
  }

  if (!prompt) return jsonErr("Param 'prompt' wajib");
  if (!process.env.OPENAI_API_KEY) {
    return jsonErr("Server belum dikonfigurasi: OPENAI_API_KEY tidak diset", 500);
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const messages: { role: "system" | "user"; content: string }[] = [];
    messages.push({
      role: "system",
      content: system || "Kamu adalah asisten AI yang ramah, jawab dalam Bahasa Indonesia kecuali diminta lain.",
    });
    messages.push({ role: "user", content: prompt });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 1024,
    });
    const reply = completion.choices[0]?.message?.content || "";
    return jsonOk({ prompt, reply, model: completion.model }, auth.ctx);
  } catch (e: any) {
    return jsonErr("AI error: " + (e?.message || "unknown"), 502);
  }
}

export const GET = handle;
export const POST = handle;
