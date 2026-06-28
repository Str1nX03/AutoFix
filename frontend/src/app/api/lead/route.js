import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["bibhanshus394@gmail.com"],
      subject: "New Lead - AutoFix",

      html: `
        <h2>New Lead Captured</h2>
        <p><strong>Email:</strong> ${email}</p>
      `,
    });

    console.log("RESEND RESPONSE:", data);

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
