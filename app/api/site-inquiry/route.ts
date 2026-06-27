import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const page = typeof body?.page === "string" ? body.page : "Unknown page";

    await resend.emails.send({
      // Replace with your verified Resend sending domain
      from: "ManSerif.Think <hello@manserifthink.com>",
      to: "lusenakalee@gmail.com",
      subject: "Website inquiry",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
          <h2 style="margin-bottom: 8px;">Website inquiry</h2>
          <p>Someone clicked &ldquo;Site by Leroy.Dev&rdquo; in the ManSerif.Think footer.</p>
          <p><strong>Page:</strong> ${page}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend site-inquiry error:", err);
    return NextResponse.json(
      { error: "Failed to send." },
      { status: 500 }
    );
  }
}