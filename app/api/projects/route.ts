import { NextRequest } from "next/server";

import { createProjectSchema } from "@/lib/validators/project.validator";

import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { createProject } from "@/lib/services/project.servise";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createProjectSchema.parse(body);

    const project = await createProject(validatedData, session.user.id);

    return Response.json(project, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: "Unexpected error" }, { status: 400 });
  }
}
