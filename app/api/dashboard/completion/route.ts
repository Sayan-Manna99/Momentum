import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { getProjectCompletionStats } from "@/lib/services/dashboard.service";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function GET() {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const stats = await getProjectCompletionStats(session.user.id);
    return successResponse(stats, 200);
  } catch (error: unknown) {
    console.error("Error fetching project completion statistics:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected error",
      500,
    );
  }
}
