import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { getUpcomingDeadlines } from "@/lib/services/dashboard.service";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";

export const GET = async () => {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const deadlines = await getUpcomingDeadlines(session.user.id, 4);
    return successResponse(deadlines, 200);
  } catch (error) {
    console.error("Error fetching upcoming deadlines:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch deadlines",
      500,
    );
  }
};
