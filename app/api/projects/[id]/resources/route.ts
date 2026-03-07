import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { createResource, getResourcesByProjectId } from "@/lib/services/resource.service";
import { createResourceSchema } from "@/lib/validators/resource.validation";

//create  resource
export async function POST(
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

    const body = await req.json();

    const validatedData = createResourceSchema.parse(body);

    const resource = await createResource(session.user.id, id, validatedData);

    return Response.json(resource, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}

//get resources by project id
export async function GET( req: NextRequest,
  { params }: { params: Promise<{ id: string }> }){
    try {
       const { id } = await params;

      if(!mongoose.Types.ObjectId.isValid(id)){
        return Response.json({error:"Invalid project ID"},{status:400});
      }
      const auth = await getAuth();

      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      const resources = await getResourcesByProjectId(session.user.id, id);
       return Response.json(resources, { status: 201 });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json({ error: "Unexpected error" }, { status: 500 });
    }
  
  
}