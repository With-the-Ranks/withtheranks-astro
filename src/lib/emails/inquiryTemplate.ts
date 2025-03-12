export const getInquiryHtml = ({
	name,
	email,
	inquiryType,
	organization,
	needs,
	timeline,
	secondaryContact,
	orgDescription,
	primaryLocation,
	subdomain,
	billingAddress,
	hearAboutUs,
	audienceSize,
	budget,
}: {
	name: string;
	email: string;
	inquiryType: string;
	organization?: string | null;
	needs?: string | null;
	timeline?: string | null;
	secondaryContact?: string | null;
	orgDescription?: string | null;
	primaryLocation?: string | null;
	subdomain?: string | null;
	billingAddress?: string | null;
	hearAboutUs?: string | null;
	audienceSize?: string | null;
	budget?: string | null;
}) => {
	// Define Inquiry Titles based on type
	const inquiryTitles: Record<string, string> = {
		"new-project": "New Project Inquiry",
		"spoke-services": "Spoke Services Inquiry",
		"general-contact": "General Contact Request",
	};

	// Get the title based on inquiry type
	const emailTitle = inquiryTitles[inquiryType] || "Inquiry Received";

	// Helper function to render only non-empty fields
	const renderField = (label: string, value?: string | null) =>
		value ? `<p><strong>${label}:</strong> ${value}</p>` : "";

	return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${emailTitle}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .logo {
          width: 140px;
          margin-bottom: 20px;
        }
        .heading {
          font-size: 24px;
          font-weight: bold;
          color: #222;
          margin-bottom: 15px;
        }
        .text {
          font-size: 16px;
          color: #555;
          margin-bottom: 10px;
        }
        .details {
          text-align: left;
          background-color: #f0f0f0;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 15px;
        }
        .details p {
          margin: 5px 0;
          font-size: 16px;
        }
        .button {
          display: inline-block;
          background-color: #02619D;
          color: #ffffff;
          padding: 12px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          font-size: 16px;
          margin-top: 20px;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }
        .button:hover {
          background-color: #024a75;
          transform: scale(1.05);
        }
        .footer {
          font-size: 14px;
          color: #777;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="https://xs17wgd2wu.ufs.sh/f/nX6SBdwGAudfZSYWGirRoanXrAMKmi2OEfD3tvHcUQseTBYp" 
             alt="With The Ranks Logo" class="logo" />
        
        <h1 class="heading">${emailTitle}</h1>
        
        <p class="text">
          Thank you, ${name}. We have received your request, and our team is reviewing your details. 
          We will reach out shortly.
        </p>

        <div class="details">
          ${renderField("Name", name)}
          ${renderField("Email", email)}
          ${renderField("Inquiry Type", inquiryType)}
          ${renderField("Organization", organization)}
          ${renderField("Needs", needs)}
          ${renderField("Timeline", timeline)}
          ${renderField("Secondary Contact", secondaryContact)}
          ${renderField("Organization Description", orgDescription)}
          ${renderField("Primary Location", primaryLocation)}
          ${renderField("Subdomain Requested", subdomain)}
          ${renderField("Billing Address", billingAddress)}
          ${renderField("How Did You Hear About Us?", hearAboutUs)}
          ${renderField("Audience Size", audienceSize)}
          ${renderField("Budget", budget)}
        </div>

        <p class="text">
          Our support team has been notified and will follow up soon. 
          If you have any urgent questions, please reach out to us.
        </p>

        <p class="text">
          For any inquiries, contact us at 
          <a href="mailto:support@withtheranks.com" style="color:#02619D;font-weight:bold;">
            support@withtheranks.com
          </a>.
        </p>
        <a
          href="mailto:support@withtheranks.com"
          style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;background-color:#02619D;color:#ffffff;padding:12px 20px 12px 20px;border-radius:6px;font-weight:bold;margin-top:20px;font-size:16px"
          target="_blank"
          ><span
            ><!--[if mso]><i style="mso-font-width:500%;mso-text-raise:18" hidden>&#8202;&#8202;</i><![endif]--></span
          ><span
            style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px"
            >Contact Support</span
          >
        </a>      
      </div>
    </body>
  </html>
  `;
};
