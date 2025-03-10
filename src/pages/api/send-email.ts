import { Resend } from "resend";
import { getInquiryHtml } from "@/lib/emails/inquiryTemplate";

export const POST = async ({
	request,
	locals,
}: {
	request: Request;
	locals: any;
}) => {
	try {
		const resend = new Resend(locals.runtime.env.RESEND_API_KEY);
		const formData = await request.formData();

		// Extracting form fields
		const email = formData.get("email") as string | null;
		const name = formData.get("name") as string | null;
		const inquiryType = formData.get("inquiryType") as string | null;
		const organization = formData.get("organization") as string | null;
		const primaryLocation = formData.get("primaryLocation") as string | null;
		const subdomain = formData.get("subdomain") as string | null;
		const billingAddress = formData.get("billingAddress") as string | null;
		const needs = formData.get("needs") as string | null;
		const timeline = formData.get("timeline") as string | null;
		const budget = formData.get("budget") as string | null;
		const secondaryContact = formData.get("secondaryContact") as string | null;
		const orgDescription = formData.get("orgDescription") as string | null;
		const hearAboutUs = formData.get("hearAboutUs") as string | null;
		const audienceSize = formData.get("audienceSize") as string | null;

		if (!email || !name || !inquiryType) {
			return new Response(
				JSON.stringify({ success: false, error: "Missing required fields" }),
				{ status: 400 }
			);
		}

		// Generate the HTML email content
		const htmlContent = getInquiryHtml({
			name,
			email,
			inquiryType,
			organization,
			primaryLocation,
			subdomain,
			billingAddress,
			needs,
			timeline,
			budget,
			secondaryContact,
			orgDescription,
			hearAboutUs,
			audienceSize,
		});

		const response = await resend.emails.send({
			from: "With The Ranks <no-reply@email.withtheranks.coop>",
			to: [email],
			cc: ["bob@withtheranks.com"],
			subject: `New ${inquiryType.replace("-", " ")} Inquiry Received`,
			html: htmlContent,
		});
		if (response.error) {
			return new Response(
				JSON.stringify({
					success: false,
					error: response.error.message ?? "Unknown error",
				}),
				{ status: 500 }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: "Email sent successfully!",
				data: response,
			}),
			{ status: 200 }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				error:
					error instanceof Error ? error.message : "An unknown error occurred",
			}),
			{ status: 500 }
		);
	}
};
