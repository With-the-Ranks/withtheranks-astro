import { Resend } from "resend";
import { google } from "googleapis";
import { getInquiryHtml } from "@/lib/emails/inquiryTemplate";
import { getNewsletterHtml } from "@/lib/emails/newsletterTemplate";

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
		const PROJECT_ID = locals.runtime.env.PROJECT_ID;
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
					timeline,
					budget,
					secondaryContact,
					orgDescription,
					hearAboutUs,
					audienceSize,
				});

		// Send email
		const response = await resend.emails.send({
			from: "With The Ranks <no-reply@email.withtheranks.coop>",
			to: [email],
			cc: ["bob@withtheranks.com"],
			subject,
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

		// Record sign-up in Google Sheets
		if (GOOGLE_SERVICE_KEY_BASE64 && GOOGLE_SHEET_ID && PROJECT_ID) {
			const credential = JSON.parse(
				Buffer.from(GOOGLE_SERVICE_KEY_BASE64, "base64").toString()
			);

			const auth = new google.auth.GoogleAuth({
				credentials: {
					client_email: credential.client_email,
					private_key: credential.private_key.replace(/\\n/g, "\n"),
				},
				projectId: PROJECT_ID,
				scopes: [
					"https://www.googleapis.com/auth/drive",
					"https://www.googleapis.com/auth/drive.file",
					"https://www.googleapis.com/auth/spreadsheets",
				],
			});

			const sheets = google.sheets({ auth, version: "v4" });

			// Format the date
			const dateSubmitted = new Date().toISOString().split("T")[0];

			// Determine what to store
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
						timeline,
						budget,
						secondaryContact,
						orgDescription,
						hearAboutUs,
						audienceSize,
					];
			// Append data to Google Sheet
			await sheets.spreadsheets.values.append({
				spreadsheetId: GOOGLE_SHEET_ID,
				range: "Sheet1",
				valueInputOption: "USER_ENTERED",
				requestBody: { values: [rowData] },
			});
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: "Email sent and recorded successfully!",
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
