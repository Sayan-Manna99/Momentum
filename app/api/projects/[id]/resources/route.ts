import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import {
  createResource,
  getResourcesByProjectId,
} from "@/lib/services/resources/resource.service";
import { createResourceSchema } from "@/lib/validators/resource.validation";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

// CREATE resource
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid project ID", 400);
    }

    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const contentType = req.headers.get("content-type");

    // ---------- PDF Upload ----------
    if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();

      const title = formData.get("title") as string;
      const file = formData.get("file") as File;

      if (!title || !file) {
        return errorResponse("Title and file are required", 400);
      }

      const resource = await createResource(session.user.id, id, {
        type: "pdf",
        title,
        file,
      });

      return successResponse(resource, 201);
    }

    // ---------- JSON Resources ----------
    const body = await req.json();
    const validatedData = createResourceSchema.parse(body);

    const resource = await createResource(session.user.id, id, validatedData);

    return successResponse(resource, 201);
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected error",
    );
  }
}

// GET resources by project ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid project ID", 400);
    }

    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const resources = await getResourcesByProjectId(session.user.id, id);

    return successResponse(resources, 200);
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected error",
    );
  }
}
