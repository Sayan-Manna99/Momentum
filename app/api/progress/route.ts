import { getAuth } from "@/lib/better-auth/auth";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { updateProgress } from "@/lib/services/progress/progress.service";

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuth();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { resourceId } = body;

    if (!resourceId) {
      return Response.json(
        { error: "resourceId is required" },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return Response.json({ error: "Invalid resource ID" }, { status: 400 });
    }

    const progress = await updateProgress(session.user.id, resourceId, body);

    return Response.json(
      {
        message: "Progress updated successfully",
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
