import { getAuth } from "@/lib/better-auth/auth";
import { getTotalResourceCount } from "@/lib/services/analytics/analytics.overview";
import { errorResponse } from "@/lib/utils/apiResponse";
import mongoose from "mongoose";
import { headers } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return errorResponse("Invalid project ID", 400);
    }

    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const analytics = await getTotalResourceCount(projectId);

    return Response.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);

    return Response.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
