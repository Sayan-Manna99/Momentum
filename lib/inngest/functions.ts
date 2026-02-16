import { inngest } from "@/lib/inngest/client";
import { sendWelcomeEmail } from "../resend/send-welcome-email";

export const signUpEmail = inngest.createFunction(
  { id: "sign-up-email" },
  { event: "api/user.created" },

  async ({ event, step }) => {
    return await step.run("send-welcome-email", async () => {
      const introText =
        "Tired of losing track of your learning progress? Momentum helps you organize your study materials, monitor your completion rate, and stay accountable with smart reminders. Keep your learning momentum going strong.";

      const {
        data: { email, name },
      } = event;

      const appUrl = process.env.NEXT_PUBLIC_APP_URL;

      if (!appUrl) {
        throw new Error("NEXT_PUBLIC_APP_URL is not defined");
      }

      const dashboardUrl = `${appUrl}/dashboard`;

      await sendWelcomeEmail({
        email,
        name,
        intro: introText,
        dashboardUrl,
      });

      return {
        success: true,
        message:"email sent successfully"
      };
    });
  },
);

//Send weekly report

export const sendWeeklyReport = inngest.createFunction(
  { id: "send-weekly-report" },
  { cron: "0 9 * * 1" }, // Monday 9AM

  async ({ step }) => {
    await step.run("generate-weekly-report", async () => {
      console.log("Weekly report job triggered");

      // TODO: fetch users from database
      // TODO: calculate progress
      // TODO: send email

      return { success: true };
    });
  },
);
