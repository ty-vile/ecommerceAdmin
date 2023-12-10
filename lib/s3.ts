"use server";

// actions
import getCurrentUser from "@/app/actions/getCurrentUser";
// s3
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getSignedS3Url() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Not authenticated");
  }

  const;

  return { url: "" };
}
