import { getAuth } from "@/lib/better-auth/auth";
import { getProgressStats } from "@/lib/services/analytics/analytics.overview";
import { errorResponse } from "@/lib/utils/apiResponse";
import mongoose from "mongoose";
import { headers } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await params;

    // ✅ Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return errorResponse("Invalid project ID", 400);
    }

    // ✅ Auth check
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const userId = session.user.id;

    // ✅ Call service
    const stats = await getProgressStats(projectId, userId);

    return Response.json(stats);
  } catch (error) {
    console.error("Error fetching progress analytics:", error);

    return Response.json(
      { error: "Failed to fetch progress analytics" },
      { status: 500 },
    );
  }
}
