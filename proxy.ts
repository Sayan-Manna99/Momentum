import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from '@/lib/better-auth/auth';

export async function proxy(request: NextRequest) {
    const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/analytics/:path*",
    "/doubtsolver/:path*",
    "/quizzes/:path*",
    "/settings/:path*",
  ],
};
