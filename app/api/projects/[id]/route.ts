import { getAuth } from "@/lib/better-auth/auth";
import {
  deleteOneProject,
  getOneProject,
  updateOneProject,
} from "@/lib/services/project.servise";
import mongoose from "mongoose";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

// GET project by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;

    if (!mongoose.Types.ObjectId.isValid(resolvedParams.id)) {
      return errorResponse("Invalid project ID", 400);
    }

    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const project = await getOneProject(session.user.id, resolvedParams.id);

    if (!project) {
      return errorResponse("Project not found", 404);
    }

    return successResponse(project);
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected error",
      400,
    );
  }
}

// PATCH project
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;

    if (!mongoose.Types.ObjectId.isValid(resolvedParams.id)) {
      return errorResponse("Invalid project ID", 400);
    }

    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const data = await req.json();

    const updatedData = {
      title: data.title,
      description: data.description,
      status: data.status,
    };

    const updatedProject = await updateOneProject(
      session.user.id,
      resolvedParams.id,
      updatedData,
    );

    if (!updatedProject) {
      return errorResponse("Project not found or update failed", 404);
    }

    return successResponse(updatedProject, 200, "Project updated successfully");
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected error",
      400,
    );
  }
}

// DELETE project
export async function DELETE(
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

    const deleted = await deleteOneProject(session.user.id, id);

    if (!deleted) {
      return errorResponse("Project not found", 404);
    }

    return successResponse(null, 200, "Project deleted successfully");
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected error",
    );
  }
}
