import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const OWNER_EMAIL = ["lusenakalee@gmail.com", "warrenkamau1@gmail.com"];
// Use your verified domain in production; for testing use onboarding@resend.dev
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string = (body?.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // ── 1. Notify the owner ────────────────────────────────────────────────
    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: "New Newsletter Subscriber",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#111;">
          <h2 style="margin-bottom:4px;">New Subscriber</h2>
          <p style="color:#666;margin-top:0;">Someone just signed up for your newsletter.</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;color:#666;width:100px;">Email</td>
              <td style="padding:6px 0;font-weight:600;">
                <a href="mailto:${email}">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#666;">Subscribed</td>
              <td style="padding:6px 0;">${new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}</td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />
          <p style="font-size:13px;color:#999;">ManSerif — Newsletter</p>
        </div>
      `,
    });

    // ── 2. Confirm to the subscriber ───────────────────────────────────────
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "You're on the list ✦ ManSerif",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#111;">
          <h2 style="margin-bottom:4px;">You're in.</h2>
          <p style="color:#666;margin-top:0;">
            Thanks for subscribing to ManSerif. You'll be the first to know about
            new collections, commissions, and collaborations.
          </p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />
          <p style="font-size:14px;color:#444;">
            We'll reach you at <strong>${email}</strong>. No spam — ever.
          </p>
          <p style="font-size:13px;color:#999;margin-top:32px;">— The ManSerif Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[newsletter]", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}