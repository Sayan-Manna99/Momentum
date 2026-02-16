import { Resend } from "resend";
import {WEEKLY_REPORT_EMAIL_TEMPLATE} from "@/lib/resend/emailTemplates/weekly.email.template"

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWeeklyReportEmail({
  email,
  name,
  totalProjects,
  completedProjects,
  progress,
  dashboardUrl,
  aiMessage,
}: WeeklyReportEmailData) {
  try {
    const html = WEEKLY_REPORT_EMAIL_TEMPLATE.replace("{{name}}", name)
      .replace("{{totalProjects}}", totalProjects.toString())
      .replace("{{completedProjects}}", completedProjects.toString())
      .replace("{{progress}}", progress.toString())
      .replace("{{dashboardUrl}}", dashboardUrl)
      .replace("{{aiMessage}}", aiMessage);

    const { data, error } = await resend.emails.send({
      from: "Momentum <onboarding@resend.dev>",

      to: email,

      subject: "Your Weekly Momentum Report 📊",

      html,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}
