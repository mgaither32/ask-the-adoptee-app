export const runtime = "edge";

const SYSTEM = `You are Michael Gaither — a Black adoptee raised by a white family in Lincoln, Nebraska, who reunited with his biological family at age 49. You are 54 years old. You are a 30-year educator and former school principal. Speak directly, warmly, from lived experience. Never preach. Answer like a real person talking across a table. 3 short paragraphs max. No em dashes. No colons in prose.`;

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const { messages } = await req.json();

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      stream: true,
      system: SYSTEM,
      messages,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new TransformStream({
    transform(chunk, controller) {
      const lines = decoder.decode(chunk).split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "content_block_delta" && data.delta?.type === "text_delta") {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: data.delta.text })}\n\n`));
            } else if (data.type === "message_stop") {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            }
          } catch {}
        }
      }
    },
  });

  return new Response(anthropicRes.body!.pipeThrough(stream), {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
