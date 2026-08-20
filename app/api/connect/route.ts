import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const trimmed = typeof email === "string" ? email.trim() : "";

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "ManSerif.Think <warren@manserifthink.com>",
      to: "warren@manserifthink.com",
      cc: "warrenkamau1@gmail.com",
      replyTo: trimmed,
      subject: "New connection request — ManSerif.Think",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
          <h2 style="margin-bottom: 8px;">New connection request</h2>
          <p>Someone reached out through the &ldquo;Let&rsquo;s Connect&rdquo; form on the ManSerif.Think website.</p>
          <p><strong>Their email:</strong> ${trimmed}</p>
          <p style="color: #777; font-size: 13px; margin-top: 24px;">
            You can reply directly to this email — it will go straight to them.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend connect error:", err);
    return NextResponse.json(
      { error: "Failed to send. Please try again." },
      { status: 500 }
    );
  }
}