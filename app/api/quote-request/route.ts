import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClerkClient, verifyToken } from "@clerk/nextjs/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const OWNER_EMAIL = "lusenakalee@gmail.com";
const FROM_EMAIL = "<anything>@eoulkeoqua.resend.app";

export async function POST(req: NextRequest) {
  try {
    // Verify the Bearer token passed from the client
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get the user
const { sub: userId } = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! }); // ✅

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await clerk.users.getUser(userId);
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: "No email on account" }, { status: 400 });
    }

    const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || userEmail;

    const body = await req.json();
    const { productId, name, price, image, slug } = body;

    if (!productId || !name) {
      return NextResponse.json(
        { error: "Missing required product fields" },
        { status: 400 }
      );
    }
    const formattedPrice = price
      ? `KES ${Number(price).toLocaleString("en-KE")}`
      : "Price not listed";

    // ── 1. Notify the owner ──────────────────────────────────────────────────
    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: `New Quote Request: ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111;">
          <h2 style="margin-bottom:4px;">New Quotation Request</h2>
          <p style="color:#666;margin-top:0;">A customer is interested in a product.</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />

          ${
            image
              ? `<img src="${image}" alt="${name}" style="width:100%;max-width:200px;border-radius:8px;margin-bottom:16px;" />`
              : ""
          }

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;color:#666;width:120px;">Product</td>
              <td style="padding:6px 0;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#666;">Product ID</td>
              <td style="padding:6px 0;">${productId}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#666;">Listed Price</td>
              <td style="padding:6px 0;">${formattedPrice}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#666;">Customer</td>
              <td style="padding:6px 0;">${userName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#666;">Email</td>
              <td style="padding:6px 0;"><a href="mailto:${userEmail}">${userEmail}</a></td>
            </tr>
          </table>

          <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />
          <p style="font-size:13px;color:#999;">Reply directly to this email to respond to the customer.</p>
        </div>
      `,
      replyTo: userEmail,
    });

    // ── 2. Confirm to the customer ───────────────────────────────────────────
    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: `We received your quote request for "${name}"`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111;">
          <h2 style="margin-bottom:4px;">Thanks for your request, ${userName.split(" ")[0]}!</h2>
          <p style="color:#666;margin-top:0;">We've received your enquiry and will get back to you with pricing shortly.</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />

          ${
            image
              ? `<img src="${image}" alt="${name}" style="width:100%;max-width:200px;border-radius:8px;margin-bottom:16px;" />`
              : ""
          }

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;color:#666;width:120px;">Product</td>
              <td style="padding:6px 0;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#666;">Reference</td>
              <td style="padding:6px 0;font-size:12px;color:#999;">${productId}</td>
            </tr>
          </table>

          <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />
          <p style="font-size:14px;">
            Expect a reply at <strong>${userEmail}</strong> within 24 hours.
            Questions? Reply to this email and we'll help right away.
          </p>
          <p style="font-size:13px;color:#999;margin-top:32px;">— The Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[quote-request]", err);
    return NextResponse.json(
      { error: "Failed to send request" },
      { status: 500 }
    );
  }
}