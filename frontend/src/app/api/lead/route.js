import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { subject, email, message } = await request.json();

    if (!subject || !email || !message) {
      return Response.json(
        { error: "Subject, Email and message are required." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["bibhanshus394@gmail.com"],
      replyTo: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2>New Contact Message</h2>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Message:</strong></p>

          <div
            style="
              padding:16px;
              border:1px solid #ddd;
              border-radius:8px;
              background:#f8f8f8;
              white-space:pre-wrap;
            "
          >
            ${message}
          </div>

          <hr />

          <p style="color:#777;font-size:13px;">
            Sent from the AutoFix website contact form.
          </p>
        </div>
      `,
    });

    return Response.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}