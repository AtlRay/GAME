import { getZayraAdapter } from "@/lib/zayra/adapter";
import type { ZayraChatRequest } from "@worldforge/types";
import { NextResponse } from "next/server";

// Server route handler — the browser never talks to a model provider
// directly. See blueprint Section 27 (Zayra AI architecture).
export async function POST(request: Request) {
  let body: Partial<ZayraChatRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body.playerId || !body.message || typeof body.message !== "string") {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  if (body.message.length > 500) {
    return NextResponse.json({ error: "message_too_long" }, { status: 400 });
  }

  const adapter = getZayraAdapter();
  const response = await adapter.respond({
    playerId: body.playerId,
    message: body.message,
    mode: body.mode,
  });

  return NextResponse.json(response);
}
