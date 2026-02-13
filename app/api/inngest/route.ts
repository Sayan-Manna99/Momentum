import { inngest } from "@/lib/inngest/client";
import { serve } from "inngest/next";

import { signUpEmail } from "@/lib/inngest/functions";

export const { GET, PUT, POST } = serve({
  client: inngest,
  functions: [signUpEmail],
});