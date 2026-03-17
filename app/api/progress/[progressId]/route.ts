import { getAuth } from "@/lib/better-auth/auth";
import mongoose from "mongoose";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import {
  getProgressByResource,
  resetProgress,
} from "@/lib/services/progress/progress.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> },
) {
  try {
    const { resourceId } = await params;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return Response.json({ error: "Invalid resource ID" }, { status: 400 });
    }

    const auth = await getAuth();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await getProgressByResource(session.user.id, resourceId);
    if (!progress) {
      return Response.json(
        { message: "Progress not started yet" },
        { status: 200 },
      );
    }
    return Response.json(progress, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> },
) {
  try {
    const { resourceId } = await params;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return Response.json({ error: "Invalid resource ID" }, { status: 400 });
    }

    const auth = await getAuth();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await resetProgress(session.user.id, resourceId);

    return Response.json(
      {
        message: "Progress reset successfully",
        progress,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
