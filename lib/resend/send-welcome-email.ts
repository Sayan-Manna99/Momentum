import { Resend } from "resend";
import { WELCOME_EMAIL_TEMPLATE } from "./emailTemplates/wellcome.email.template";
const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendWelcomeEmail({
  email,
  name,
  dashboardUrl,
}: WelcomeEmailData) {
  const html = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace(
    "{{dashboardUrl}}",
    dashboardUrl,
  );

  return await resend.emails.send({
    from: "Momentum <onboarding@resend.dev>",
    to: email,
    subject: "Welcome to Momentum 🚀",
    html,
  });
}
