import { getAuth } from "@/lib/better-auth/auth";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { updateProgress } from "@/lib/services/progress/progress.service";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuth();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const { resourceId } = body;

    if (!resourceId) {
      return errorResponse("resourceId is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return errorResponse("Invalid resource ID", 400);
    }

    const progress = await updateProgress(session.user.id, resourceId, body);

    return successResponse(progress, 200, "Progress updated successfully");
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected error",
    );
  }
}
