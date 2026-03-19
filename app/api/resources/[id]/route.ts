import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import {
  deleteResourceById,
  getResourceById,
  updateResourceById,
} from "@/lib/services/resources/resource.service";
import { updateResourceSchema } from "@/lib/validators/resource.validation";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

// GET single resource
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

    const resource = await getResourceById(session.user.id, id);

    if (!resource) {
      return errorResponse("Resource not found", 404);
    }

    return successResponse(resource);
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected error",
    );
  }
}

// PATCH resource
export async function PATCH(
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

    const body = await req.json();
    const validatedData = updateResourceSchema.parse(body);

    const updatedResource = await updateResourceById(
      session.user.id,
      id,
      validatedData,
    );

    if (!updatedResource) {
      return errorResponse("Resource not found", 404);
    }

    return successResponse(
      updatedResource,
      200,
      "Resource updated successfully",
    );
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected error",
    );
  }
}

// DELETE resource
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

    const deletedResource = await deleteResourceById(session.user.id, id);

    if (!deletedResource) {
      return errorResponse("Resource not found", 404);
    }

    return successResponse(null, 200, "Resource deleted successfully");
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected error",
    );
  }
}
