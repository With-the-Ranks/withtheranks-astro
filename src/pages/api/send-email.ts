import { Resend } from 'resend';
import 'dotenv/config'; // Load environment variables
import { getNewsletterHtml } from '@/lib/emails/newsletterTemplate';

export const prerender = false; // Ensure this is a server-rendered route

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string | null;
    const name = formData.get("name") as string | null;

    if (!email || !name) {
      return new Response(JSON.stringify({ success: false, error: "Missing fields" }), { status: 400 });
    }

    const htmlContent = getNewsletterHtml(name);

    const response = await resend.emails.send({
      from: 'With The Ranks <no-reply@email.withtheranks.coop>',
      to: [email],
      subject: 'Welcome to Our Newsletter!',
      html: htmlContent,
    });

    if (response.error) {
      return new Response(JSON.stringify({ success: false, error: response.error.message ?? "Unknown error" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully!", data: response }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : "An unknown error occurred" }), { status: 500 });
  }
};
