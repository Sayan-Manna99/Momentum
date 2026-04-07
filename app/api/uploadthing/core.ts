import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

const f = createUploadthing();

export const ourFileRouter = {
  resourceUploader: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    video: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async () => {
     
      const auth = await getAuth();

      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        throw new UploadThingError("Unauthorized");
      }

      return {
        userId: session.user.id,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload complete for:", metadata.userId);

      return {
        url: file.ufsUrl,
        uploadedBy: metadata.userId,
        name: file.name,
        type: file.type,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
