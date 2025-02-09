import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  serviceImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  })
    .middleware(async () => {
      // This code runs on your server before upload
      try {
        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { timestamp: Date.now() };
      } catch (error) {
        console.error("Error in uploadthing middleware:", error);
        throw new Error("Failed to process upload");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      try {
        console.log("Upload complete", { metadata, file });
        return { url: file.url };
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        throw new Error("Failed to process upload");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
