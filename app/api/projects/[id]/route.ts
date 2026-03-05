import { getAuth } from "@/lib/better-auth/auth";
import {
  deleteOneProject,
  getOneProject,
  updateOneProject,
} from "@/lib/services/project.servise";
import mongoose from "mongoose";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
//get the project by id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    if (!mongoose.Types.ObjectId.isValid(resolvedParams.id)) {
      return Response.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    // then call service
    const project = await getOneProject(session.user.id, resolvedParams.id);
    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }
    return Response.json(project);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: "Unexpected error" }, { status: 400 });
  }
}

//update the project
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    if (!mongoose.Types.ObjectId.isValid(resolvedParams.id)) {
      return Response.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    //call the data
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
      return Response.json(
        { error: "Project not found or update failed" },
        { status: 404 },
      );
    }
    return Response.json(
      {
        message: "Project updated successfully",
        project: updatedProject,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: "Unexpected error" }, { status: 400 });
  }
}

//delete the project
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await deleteOneProject(session.user.id, id);

    if (!deleted) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    return Response.json(
      { message: "Project deleted successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}