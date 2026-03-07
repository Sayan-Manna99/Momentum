import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import {
  deleteResourceById,
  getResourceById,
  updateResourceById,
} from "@/lib/services/resource.service";
import { updateResourceSchema } from "@/lib/validators/resource.validation";

//get single resource by id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid resource ID" }, { status: 400 });
    }

    const auth = await getAuth();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resource = await getResourceById(session.user.id, id);

    if (!resource) {
      return Response.json({ error: "Resource not found" }, { status: 404 });
    }

    return Response.json(resource, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}

//Update resource by id

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid resource ID" }, { status: 400 });
    }

    const auth = await getAuth();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const validatedData = updateResourceSchema.parse(body);

    const updatedResource = await updateResourceById(
      session.user.id,
      id,
      validatedData,
    );

    if (!updatedResource) {
      return Response.json({ error: "Resource not found" }, { status: 404 });
    }

    return Response.json(updatedResource, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}

//delete resource by id

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid resource ID" }, { status: 400 });
    }

    const auth = await getAuth();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const deletedResource = await deleteResourceById(
      session.user.id,
      id,
    );

  if (!deletedResource) {
    return Response.json({ error: "Resource not found" }, { status: 404 });
  }

  return Response.json(
    { message: "Resource deleted successfully" },
    { status: 200 },
  );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}