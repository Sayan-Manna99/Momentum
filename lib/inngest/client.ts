import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "Momentum",
  eventKey: process.env.INNGEST_EVENT_KEY, // ✅ REQUIRED
  ai: { gemini: { apikey: process.env.GEMINI_API_KEY! } },
});