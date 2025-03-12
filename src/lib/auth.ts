// Decode Service Account JSON
// Following this guide: https://hookdeck.com/blog/how-to-call-google-cloud-apis-from-cloudflare-workers

export const getGoogleAccessToken = async (GOOGLE_SERVICE_KEY_BASE64: string) => {
	try {
		const credential = JSON.parse(atob(GOOGLE_SERVICE_KEY_BASE64));
		const tokenUrl = "https://oauth2.googleapis.com/token";
		const jwtHeader = { alg: "RS256", typ: "JWT" };
		const now = Math.floor(Date.now() / 1000);

		const jwtClaimSet = {
			iss: credential.client_email,
			scope: "https://www.googleapis.com/auth/spreadsheets",
			aud: tokenUrl,
			exp: now + 3600,
			iat: now,
		};

		const encoder = new TextEncoder();
		const toBase64Url = (str: Uint8Array) =>
			btoa(String.fromCharCode(...str))
				.replace(/\+/g, "-")
				.replace(/\//g, "_")
				.replace(/=+$/, "");

		const importKey = await crypto.subtle.importKey(
			"pkcs8",
			Uint8Array.from(
				atob(
					credential.private_key.replace(/-----\w+ PRIVATE KEY-----|\n/g, "")
				),
				(c) => c.charCodeAt(0)
			),
			{ name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
			false,
			["sign"]
		);

		const jwtUnsigned =
			toBase64Url(encoder.encode(JSON.stringify(jwtHeader))) +
			"." +
			toBase64Url(encoder.encode(JSON.stringify(jwtClaimSet)));

		const signature = await crypto.subtle.sign(
			"RSASSA-PKCS1-v1_5",
			importKey,
			encoder.encode(jwtUnsigned)
		);

		const jwt = jwtUnsigned + "." + toBase64Url(new Uint8Array(signature));

		// Exchange JWT for OAuth Access Token
		const tokenResponse = await fetch(tokenUrl, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
				assertion: jwt,
			}),
		});

		const { access_token } = await tokenResponse.json();
		if (!access_token) throw new Error("Failed to retrieve access token");

		return access_token;
	} catch (error) {
		throw new Error(`OAuth Error: ${error instanceof Error ? error.message : "Unknown error"}`);
	}
};
