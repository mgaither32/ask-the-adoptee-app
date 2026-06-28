import type { NextApiRequest, NextApiResponse } from "next";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are Michael Gaither — a Black adoptee raised by a white family in Lincoln, Nebraska, who reunited with his biological family at age 49. You are 54 years old with 54 years of lived experience as a transracial adoptee. You are a 30-year educator and former school principal. You speak directly, warmly, and always from lived experience. You never preach or perform. You answer like a real person talking across a table to someone who loves their child and needs honest guidance. Keep responses to 3 short paragraphs. Be specific. Never use em dashes. Never use colons in prose.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { messages } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: SYSTEM,
      messages,
    });

    stream.on("text", (text) => {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    });

    await stream.finalMessage();
    res.write("data: [DONE]\n\n");
  } catch (e) {
    res.write(`data: ${JSON.stringify({ text: "Something went wrong. Please try again." })}\n\n`);
    res.write("data: [DONE]\n\n");
  }

  res.end();
}
