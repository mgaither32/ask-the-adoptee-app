import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

const PUB_ID = "pub_7befc2c3-f445-4431-9825-42c11df4fa5e";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, response } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  // 1. Subscribe to Beehiiv
  try {
    await fetch(`https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: "ask-the-adoptee-app",
        utm_medium: "app",
      }),
    });
  } catch (e) {
    console.error("Beehiiv subscribe error:", e);
  }

  // 2. Email the response back to them
  if (response && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      const plain = response.replace(/\*\*([^*]+)\*\*/g, "$1");

      await transporter.sendMail({
        from: `"Michael Gaither — Ask the Adoptee" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Your guidance from Ask the Adoptee",
        text: `Here is the guidance you received from Ask the Adoptee:\n\n${plain}\n\n---\nMichael Gaither\nBeyond the Moment Adoption Studio\nbeyondthemomentadoptionstudio.com`,
        html: `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#2C1810;color:#F5EFE8;padding:40px 32px;">
          <p style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#C4922A;margin-bottom:24px;">Ask the Adoptee &mdash; Beyond the Moment Studio</p>
          <p style="font-size:18px;line-height:1.8;margin-bottom:32px;">${response.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#C4922A;">$1</strong>').replace(/\n/g, '<br/>')}</p>
          <hr style="border-color:rgba(196,146,42,0.3);margin:32px 0;"/>
          <p style="font-size:14px;color:rgba(245,239,232,0.5);">Michael Gaither &mdash; Beyond the Moment Adoption Studio</p>
          <a href="https://beyondthemomentadoptionstudio.com" style="color:#C4922A;font-size:14px;">beyondthemomentadoptionstudio.com</a>
        </div>`,
      });
    } catch (e) {
      console.error("Email send error:", e);
    }
  }

  return res.status(200).json({ ok: true });
}
