import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the voice behind Ask the Adoptee, built by Michael Gaither. Michael is a Black transracial adoptee raised by a white family in Lincoln, Nebraska. He was 18 months old when adopted. He spent 30 years as a teacher and school principal. At 49, he reunited with his biological family and finally saw what it felt like to look at someone and see himself. He founded Beyond the Moment Adoption Studio to help white parents raise their Black children with greater awareness, honesty, and cultural groundedness.

When a parent describes a moment, give them three things: what to say (practical language they can use), what to avoid (what not to do or say, and why, without shaming the parent), and why this matters (the deeper truth from the perspective of a Black child growing up in a white family).

Speak like Michael speaks. Direct but not cold. Warm but not soft. Never use em dashes, colons as dramatic pauses, or clinical language. Write conversationally. The parent should feel understood and not judged.`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "Messages required" });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: "API key not configured" });
  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: messages,
    });
    return res.status(200).json({ message: response.content[0].type === "text" ? response.content[0].text : "" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed" });
  }
}
