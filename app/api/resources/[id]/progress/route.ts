import { getAuth } from "@/lib/better-auth/auth";
import mongoose from "mongoose";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import {
  getProgressByResource,
  resetProgress,
} from "@/lib/services/progress/progress.service";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid resource ID", 400);
    }

    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const progress = await getProgressByResource(session.user.id, id);

    if (!progress) {
      return successResponse(null, 200, "Progress not started yet");
    }

    return successResponse(progress, 200);
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected error",
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid resource ID", 400);
    }

    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const progress = await resetProgress(session.user.id, id);

    return successResponse(progress, 200, "Progress reset successfully");
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected error",
    );
  }
}
