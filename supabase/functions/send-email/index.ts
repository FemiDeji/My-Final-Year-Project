/// <reference types="https://deno.land/std@0.224.0/types.d.ts" />

import { serve } from "https://deno.land/std@0.224.0/http/mod.ts";
import { Resend } from "npm:resend";

serve(async (req: Request) => {
	const { to, subject, html } = await req.json();
	const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

	try {
		const { data, error } = await resend.emails.send({
			from: "Passbook App <onboarding@resend.dev>",
			to,
			subject,
			html,
		});

		if (error) {
			return new Response(JSON.stringify({ error }), { status: 500 });
		}
		console.log("Email sent", data);

		return new Response(JSON.stringify({ success: true }));
	} catch (err) {
		console.error("Email sending failed", err);
		return new Response("Internal server error", { status: 500 });
	}
});
