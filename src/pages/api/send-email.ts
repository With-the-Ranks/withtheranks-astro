import { Resend } from "resend";
import { getInquiryHtml } from "@/lib/emails/inquiryTemplate";
import { getNewsletterHtml } from "@/lib/emails/newsletterTemplate";
import { getGoogleAccessToken } from "@/lib/auth";

export const POST = async ({
	request,
	locals,
}: {
	request: Request;
	locals: any;
}) => {
	try {
		const GOOGLE_SERVICE_KEY_BASE64 =
			locals.runtime.env.GOOGLE_SERVICE_KEY_BASE64;
		const GOOGLE_SHEET_ID = locals.runtime.env.GOOGLE_SHEET_ID;
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

		const isQuickSignUp = !inquiryType;

		if (!email || !name) {
			return new Response(
				JSON.stringify({ success: false, error: "Missing required fields" }),
				{ status: 400 }
			);
		}
		const timelineMapping = ["ASAP", "1-2 months", "3-6 months", "Flexible"];
		const budgetMapping = ["$2k-$5k", "$5k-$10k", "$10k+$", "Unsure"];

		const timelineLabel = timeline
			? timelineMapping[Number.parseInt(timeline) - 1]
			: "";
		const budgetLabel = budget
			? budgetMapping[Number.parseInt(budget) - 1]
			: "";

		// Determine subject & HTML template
		const subject = isQuickSignUp
			? "Welcome to Our Newsletter!"
			: `New ${inquiryType.replace("-", " ")} Inquiry Received`;

		const htmlContent = isQuickSignUp
			? getNewsletterHtml(name)
			: getInquiryHtml({
					name,
					email,
					inquiryType,
					organization,
					primaryLocation,
					subdomain,
					billingAddress,
					needs,
					timeline: timelineLabel, // using the label here
					budget: budgetLabel,  
					secondaryContact,
					orgDescription,
					hearAboutUs,
					audienceSize,
				});

		// Send email
		const emailResponse = isQuickSignUp ? { error: null } : await resend.emails.send({
			from: "With The Ranks <no-reply@email.withtheranks.coop>",
			to: [email],
			cc: ["support@withtheranks.com"],
			subject,
			html: htmlContent,
		});

		if (emailResponse.error) {
			return new Response(
				JSON.stringify({
					success: false,
					error: emailResponse.error.message ?? "Unknown error",
				}),
				{ status: 500 }
			);
		}

		const access_token = await getGoogleAccessToken(GOOGLE_SERVICE_KEY_BASE64);
		if (!access_token) throw new Error("Failed to retrieve access token");

		// Append Data to Google Sheets
		const dateSubmitted = new Date().toISOString().split("T")[0];
		const rowData = isQuickSignUp
			? [name, email, "newsletter-signup", dateSubmitted]
			: [
					name,
					email,
					inquiryType,
					dateSubmitted,
					organization,
					primaryLocation,
					subdomain,
					billingAddress,
					needs,
					timelineLabel,
					budgetLabel, 
					secondaryContact,
					orgDescription,
					hearAboutUs,
					audienceSize,
				];

		const sheetsResponse = await fetch(
			`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ values: [rowData] }),
			}
		);

		if (!sheetsResponse.ok) {
			throw new Error(
				`Google Sheets API error: ${await sheetsResponse.text()}`
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: "Email sent and recorded successfully!",
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
