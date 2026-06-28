import type { NextApiRequest, NextApiResponse } from "next";

const PUB_ID = "pub_7befc2c3-f445-4431-9825-42c11df4fa5e";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, response } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  // 1. Subscribe to Beehiiv
  try {
    const beehiivKey = process.env.BEEHIIV_API_KEY;
    if (beehiivKey) {
      await fetch(`https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${beehiivKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: "ask-the-adoptee-app",
          utm_medium: "app",
        }),
      });
    }
  } catch (e) {
    console.error("Beehiiv subscribe error:", e);
  }

  // 2. Email the response via Resend (pure fetch — no npm package needed)
  if (response && process.env.RESEND_API_KEY) {
    try {
      const html = `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#2C1810;color:#F5EFE8;padding:40px 32px;border-radius:8px;">
          <p style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#C4922A;margin:0 0 24px;">Ask the Adoptee &mdash; Beyond the Moment Studio</p>
          <p style="font-size:17px;line-height:1.8;margin:0 0 32px;">${response
            .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#C4922A;">$1</strong>')
            .replace(/\n/g, "<br/>")}</p>
          <hr style="border:none;border-top:1px solid rgba(196,146,42,0.3);margin:32px 0;"/>
          <p style="font-size:13px;color:rgba(245,239,232,0.5);margin:0 0 6px;">Michael Gaither &mdash; Beyond the Moment Adoption Studio</p>
          <a href="https://payhip.com/b/hD5Qj" style="color:#C4922A;font-size:14px;font-weight:bold;text-decoration:none;">
            Get the full guide &mdash; Raising a Black Child in a White Family ($17) &rarr;
          </a>
        </div>`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Michael Gaither <hello@beyondthemomentadoptionstudio.com>",
          to: [email],
          subject: "Your guidance from Ask the Adoptee",
          html,
        }),
      });
    } catch (e) {
      console.error("Email send error:", e);
    }
  }

  return res.status(200).json({ ok: true });
}
